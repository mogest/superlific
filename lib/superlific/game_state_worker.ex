defmodule Superlific.GameStateWorker do
  use GenServer

  @game_length 90_000
  @intermission_length 15_000

  def start_link do
    GenServer.start_link(__MODULE__, nil, name: __MODULE__)
  end

  # API

  def game_state do
    GenServer.call(__MODULE__, :game_state)
  end

  def raw_game_state do
    GenServer.call(__MODULE__, :raw_game_state)
  end

  # Callbacks

  def init(_state) do
    send(self, :start_game)
    {:ok, :startup}
  end

  def handle_call(:game_state, _sender, :startup) do
    state = %Superlific.GameState{state: :intermission}

    {:reply, state, :startup}
  end

  def handle_call(:game_state, _sender, data) do
    {:reply, data, data}
  end

  def handle_call(:raw_game_state, _sender, data) do
    {:reply, data, data}
  end

  def handle_call({:set_game_state, data}, _sender, _state) do
    Superlific.RoomChannel.broadcast_state_change(data)
    {:reply, :ok, data}
  end

  def handle_info(:start_game, _state) do
    create_grid
    {:noreply, :startup}
  end

  def handle_info(:end_game, state) do
    if state.players do
      Superlific.PlayersServer.stop(state.players)
    end

    new_state = start_intermission(state)
    Superlific.RoomChannel.broadcast_state_change(new_state)
    {:noreply, new_state}
  end

  # Private

  defp create_grid do
    ref = Process.send_after(self, :end_game, @game_length)

    Task.start_link(fn ->
      # TODO : need a better seed mechanism
      :random.seed(:os.system_time)
      grid = Superlific.GridCreator.create
      answers = Superlific.GridSolver.solve(grid, load_dictionary)
      {:ok, players_server} = Superlific.PlayersServer.start_link

      new_state = %Superlific.GameState{
        state: :live,
        grid: grid,
        answers: answers,
        timer: ref,
        players: players_server
      }

      GenServer.call(__MODULE__, {:set_game_state, new_state})
    end)
  end

  defp load_dictionary do
    Superlific.DictionaryAgent.dictionary
  end

  defp start_intermission(state) do
    ref = Process.send_after(self, :start_game, @intermission_length)

    %Superlific.GameState{
      state: :intermission,
      grid: state.grid,
      answers: state.answers,
      timer: ref
    }
  end
end
