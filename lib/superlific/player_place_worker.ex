defmodule Superlific.PlayerPlaceWorker do
  use GenServer

  @notify_interval 2000

  def start_link(players_pid) do
    GenServer.start_link(__MODULE__, players_pid)
  end

  # Callbacks

  def init(players_pid) do
    Process.monitor(players_pid) # TODO : this seems backwards; how can I get PlayersServer to kill me when it dies?
    queue_notify
    {:ok, players_pid}
  end

  def handle_call(:positions, _sender, players_pid) do
    {:reply, get_player_positions(players_pid), players_pid}
  end

  def handle_info(:notify, players_pid) do
    get_player_positions(players_pid)
    |> Superlific.RoomChannel.broadcast_player_positions

    queue_notify

    {:noreply, players_pid}
  end

  def handle_info({:DOWN, _ref, :process, _pid, _reason}, players_pid) do
    {:stop, :normal, players_pid}
  end

  # Private

  defp queue_notify do
    Process.send_after(self, :notify, @notify_interval)
  end

  defp get_player_positions(players_pid) do
    {_, token_points} = Superlific.PlayersServer.state(players_pid)

    calculate_player_positions(token_points)
  end

  defp calculate_player_positions(token_points) do
    token_points
    |> Enum.sort_by(fn {_token, points} -> points end, &>=/2)
    |> Enum.chunk_by(fn {_token, points} -> points end)
    |> Enum.map_reduce(1, fn chunk, position -> {{chunk, position}, position + length(chunk)} end)
    |> elem(0)
    |> Enum.reduce(%{}, fn {chunk, position}, acc ->
      Enum.reduce(chunk, acc, fn {token, _}, acc -> Map.put(acc, token, {position, length(chunk) > 1}) end)
    end)
  end
end
