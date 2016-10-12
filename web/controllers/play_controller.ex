defmodule Superlific.PlayController do
  use Superlific.Web, :controller

  def index(conn, _params) do
    render conn, "index.html", token: :crypto.strong_rand_bytes(16) |> Base.url_encode64
  end
end
