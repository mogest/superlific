defmodule Superlific.GridCreator do
  @letter_frequencies [
    63693, 11853, 13825, 32252, 88494, 13126,
    16072, 35514, 35389, 2714, 11422, 35218,
    17926, 46774, 53892, 11087, 1743, 34450,
    39709, 72232, 23040, 8510, 19149, 1994,
    19439, 1361
  ]

  @indexed_letter_frequencies Enum.with_index(@letter_frequencies)

  @letter_sum Enum.sum(@letter_frequencies)

  def create do
    count = 16

    grid = for _ <- 1..count, do: generate_letter

    if valid_grid?(grid, count) do
      Enum.join(grid)
    else
      create
    end
  end

  defp generate_letter do
    <<generate_letter_offset + 65>>
  end

  defp generate_letter_offset do
    random_number = :random.uniform(@letter_sum)

    Enum.reduce_while(@indexed_letter_frequencies, random_number, fn {value, index}, acc ->
      if acc < value, do: {:halt, index}, else: {:cont, acc - value}
    end)
  end

  defp valid_grid?(grid, count) do
    valid_vowels?(grid, count) and valid_consonants?(grid, count)
  end

  def valid_vowels?(grid, count) do
    vowel_count(grid) in 4..div(count, 2)
  end

  defp vowel_count(grid) do
    Enum.count(grid, fn letter -> letter in ~w(A E I O U) end)
  end

  def valid_consonants?(grid, count) do
    max_consonant_count(grid) <= div(count, 6)
  end

  defp max_consonant_count(grid) do
    grid
    |> Enum.reject(fn letter -> letter in ~w(A E I O U) end)
    |> Enum.group_by(fn x -> x end)
    |> Enum.map(fn {_, matches} -> Enum.count(matches) end)
    |> Enum.max
  end
end
