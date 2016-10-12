import xs from 'xstream';

function makePhoenixChannelDriver(channel) {
  let joined = false;

  return function(output$) {
    let responseProxies = {};

    output$.addListener({
      next(output) {
        let pushResponse = channel.push(output.event, output.data);
        pushResponse.request = output;
        let proxy = responseProxies[output.event];

        proxy.shamefullySendNext(pushResponse);
      },

      error(message) {
        console.log(message);
      },

      complete() {
      },
    });

    return {
      events(event) {
        return xs.create({
          start(listener) {
            channel.on(event, data => listener.next({event, data}));

            if (!joined) {
              joined = true;

              channel.join()
                .receive("ok", () => { })
                .receive("error", message => listener.error(message))
            }
          },

          stop() {
            channel.off(event);
          }
        });
      },

      responses(event) {
        let proxy = responseProxies[event];
        if (!proxy) { responseProxies[event] = proxy = xs.create(); }

        return {
          events(callbackEventName) {
            return proxy.map(response => {
              return xs.create({
                start(listener) {
                  response.receive(callbackEventName, data => {
                    data.request = response.request;

                    listener.next(data)
                  })
                },

                stop() {
                }
              })
            }).flatten()
          }
        };
      },
    };
  };
}

export {makePhoenixChannelDriver};
