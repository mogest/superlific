defmodule Superlific.DictionaryAgent do
  def start_link do
    Agent.start_link(&load_dictionary/0, name: __MODULE__)
  end

  def dictionary do
    Agent.get(__MODULE__, fn x -> x end)
  end

  defp load_dictionary do
    Application.app_dir(:superlific, "priv")
    |> Path.join("sowpods.txt")
    |> File.read!
    |> String.split("\n")
    |> Enum.filter(fn word -> String.length(word) >= 3 end)
    |> Enum.map(fn word ->
      {word, word |> String.replace("QU", "Q") |> to_charlist |> Enum.map(fn letter -> letter - 65 end)}
    end)
  end
end
