defmodule Superlific.GridSolver do
  @grid_size 4

  def solve(grid, dictionary) do
    letter_map = build_letter_map(grid)
    relations = build_relations(grid)
    visits = Tuple.duplicate(false, 26)

    Enum.filter_map(dictionary, &contains_word?(&1, letter_map, relations, visits), &elem(&1, 0))
  end

  defp contains_word?({_word, [first_letter|letters]}, letter_map, relations, visits) do
    if starting_indexes = elem(letter_map, first_letter) do
      Enum.any?(starting_indexes, &contains_letters?(&1, letters, relations, visits))
    else
      false
    end
  end

  defp contains_letters?(_, [], _, _) do
    true
  end

  defp contains_letters?(index, letters, relations, visits) do
    [next_letter|remaining_letters] = letters

    next_indexes = relations |> elem(index) |> elem(next_letter)

    if next_indexes do
      next_indexes
      |> Enum.reject(fn next_index -> elem(visits, next_index) end)
      |> Enum.any?(fn next_index -> contains_letters?(next_index, remaining_letters, relations, put_elem(visits, index, true)) end)
    else
      false
    end
  end

  defp build_letter_map(grid) do
    grid
    |> String.codepoints
    |> Enum.with_index
    |> Enum.group_by(fn {letter, _} -> letter end, fn {_, index} -> index end)
    |> letter_map_to_tuple
  end

  defp build_relations(grid) do
    directions = for x <- -1..1, y <- -1..1, x != 0 or y != 0, do: {x, y}

    cell_count = @grid_size * @grid_size
    grid_range = 0..@grid_size - 1

    Enum.reduce(0..cell_count-1, {}, fn index, acc ->
      x = rem(index, @grid_size)
      y = div(index, @grid_size)

      Tuple.append acc, directions
      |> Enum.map(fn {dx, dy} -> {x + dx, y + dy} end)
      |> Enum.filter(fn {nx, ny} -> nx in grid_range and ny in grid_range end)
      |> Enum.map(fn {nx, ny} -> ny * @grid_size + nx end)
      |> Enum.map(fn new_index -> {new_index, String.at(grid, new_index)} end)
      |> Enum.group_by(fn {_, new_letter} -> new_letter end, fn {new_index, _} -> new_index end)
      |> letter_map_to_tuple
    end)
  end

  # Converts a map %{"A" => [1, 2], "C" => [3]} to a tuple {[1, 2], nil, [3], ...}
  defp letter_map_to_tuple(map) do
    Enum.reduce(map, Tuple.duplicate(nil, 26), fn {key, values}, tuple ->
      Tuple.insert_at(tuple, hd(to_charlist(key)) - 65, values)
    end)
  end
end
