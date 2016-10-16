defmodule Superlific.RoomChannel do
  use Phoenix.Channel

  intercept ["game_state", "duplication", "positions"]

  # API

  def broadcast_state_change(game_state) do
    if Enum.member?(Process.registered, Superlific.Endpoint) do
      Superlific.Endpoint.broadcast("room:4x4/3", "game_state", build_game_state_message(game_state))

      if game_state.state == :live do
        Superlific.Endpoint.broadcast("room:4x4/3", "player_state", %{words: [], points: 0})
      end
    end
  end

  def broadcast_player_positions(positions) do
    Superlific.Endpoint.broadcast("room:4x4/3", "positions", %{positions: positions, count: Map.size(positions)})
  end

  def notify_duplication(token, word, points) do
    Superlific.Endpoint.broadcast("room:4x4/3", "duplication", %{token: token, word: word, points: points})
  end

  # Callbacks

  def join("room:4x4/3", %{"token" => token}, socket) do
    send(self, :joined)

    socket = assign(socket, :token, token)

    {:ok, socket}
  end

  def join("room:" <> _private_room_id, _params, _socket) do
    {:error, %{reason: "no such configuration"}}
  end

  def handle_in("answer", %{"word" => word}, socket) do
    game_state = Superlific.GameStateWorker.raw_game_state

    if game_state.state == :live do
      if word in game_state.answers do
        response = Superlific.PlayersServer.add_answer(game_state.players, socket.assigns[:token], word)
        {:reply, response, socket}
      else
        {:reply, :invalid, socket}
      end
    else
      {:noreply, socket}
    end
  end

  def handle_out("game_state", msg, socket) do
    push socket, "game_state", msg

    case msg.state do
      "live" -> {:noreply, assign(socket, :last_position, nil)}
      _      -> {:noreply, socket}
    end
  end

  def handle_out("duplication", msg, socket) do
    if socket.assigns[:token] == msg.token do
      push socket, "duplication", msg
    end

    {:noreply, socket}
  end

  def handle_out("positions", data, socket) do
    case data.positions[socket.assigns[:token]] do
      {position, equal} ->
        message = %{position: position, equal: equal, count: data.count}

        if socket.assigns[:last_position] != message do
          push socket, "position", message
          {:noreply, assign(socket, :last_position, message)}
        else
          {:noreply, socket}
        end

      _ -> {:noreply, socket}
    end
  end

  def handle_info(:joined, socket) do
    game_state = Superlific.GameStateWorker.game_state
    push_game_state(game_state, socket)

    if game_state.players do
      {words, points} = Superlific.PlayersServer.player_state(game_state.players, socket.assigns[:token])
      push(socket, "player_state", %{words: words, points: points})
    end

    {:noreply, socket}
  end

  # Private

  defp push_game_state(game_state, socket) do
    push(socket, "game_state", build_game_state_message(game_state))
  end

  defp build_game_state_message(game_state) do
    case game_state do
      %Superlific.GameState{state: :live, grid: grid, answers: answers, timer: ref} ->
        %{state: "live", grid: grid, answer_count: length(answers), remaining_msecs: Process.read_timer(ref)}
      %Superlific.GameState{state: :intermission, timer: nil} ->
        %{state: "intermission", remaining_msecs: 0}
      %Superlific.GameState{state: :intermission, grid: grid, answers: answers, timer: ref} ->
        %{state: "intermission", grid: grid, answers: answers, remaining_msecs: Process.read_timer(ref)}
      _ ->
        %{state: "unknown"}
    end
  end
end
