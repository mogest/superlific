defmodule Superlific.PlayersServer do
  use GenServer

  @points {0, 0, 0, 1, 2, 3, 5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17}

  def start_link do
    GenServer.start_link(__MODULE__, {%{}, %{}})
  end

  def add_answer(pid, token, word) do
    GenServer.call(pid, {:add_answer, token, word})
  end

  def player_state(pid, token) do
    GenServer.call(pid, {:player_state, token})
  end

  def state(pid) do
    GenServer.call(pid, :state)
  end

  def stop(pid) do
    GenServer.stop(pid)
  end

  # Callbacks

  def init(state) do
    Superlific.PlayerPlaceWorker.start_link(self)
    {:ok, state}
  end

  def handle_call({:add_answer, token, word}, _from, state) do
    {word_tokens, _points} = state
    tokens = word_tokens[word]

    if tokens && (token in tokens) do
      {:reply, :existing, state}
    else
      count = if tokens, do: MapSet.size(tokens), else: 0

      case count do
        0 ->
          new_state = mutate(state, token, calculate_points(word), word)
          {:reply, {:unique, %{points: elem(new_state, 1)[token]}}, new_state}

        1 ->
          duplicated_token = hd(MapSet.to_list(tokens))

          new_state = state
          |> mutate(token, 0, word)
          |> mutate(duplicated_token, -calculate_points(word))

         Superlific.RoomChannel.notify_duplication(duplicated_token, word, elem(new_state, 1)[duplicated_token])

          {:reply, :duplicate, new_state}

        _ ->
          {:reply, :duplicate, mutate(state, token, 0, word)}
      end
    end
  end

  def handle_call(:state, _from, state) do
    {:reply, state, state}
  end

  def handle_call({:player_state, token}, _from, state) do
    {word_tokens, token_points} = state

    points = token_points[token]

    if points == nil do
      {:reply, {[], 0}, state}
    else
      words = Enum.filter_map(word_tokens, fn {_, tokens} -> token in tokens end, fn {word, _} -> word end)

      {:reply, {words, points}, state}
    end
  end

  defp calculate_points(word) do
    elem(@points, String.length(word))
  end

  defp mutate({word_tokens, token_points}, token, points) do
    {
      word_tokens,
      mutate_points(token_points, token, points)
    }
  end

  defp mutate({word_tokens, token_points}, token, points, word) do
    {
      mutate_word_tokens(word_tokens, token, word),
      mutate_points(token_points, token, points)
    }
  end

  defp mutate_word_tokens(word_tokens, token, word) do
    tokens = word_tokens[word] || MapSet.new
    Map.put(word_tokens, word, MapSet.put(tokens, token))
  end

  defp mutate_points(token_points, token, points) do
    existing_points = token_points[token] || 0
    Map.put(token_points, token, existing_points + points)
  end
end
