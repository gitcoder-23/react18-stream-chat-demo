import React, { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  Message,
  MessageList,
  MessageInput,
  Thread,
  LoadingChannels,
  LoadingIndicator,
  LoadingIndicatorIcon,
} from 'stream-chat-react';
import '@stream-io/stream-chat-css/dist/css/index.css';
import 'stream-chat-react/dist/css/index.css';

let appApiKey = process.env.REACT_APP_STREAM_API_KEY;

const user = {
  id: 'john',
  name: 'John Doe',
  image:
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80',
};
const ChatStream = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(appApiKey);
      await chatClient.connectUser(user, chatClient.devToken(user.id));

      const channel = chatClient.channel('messaging', 'react-talk', {
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png',
        name: 'Talk With Developers',
        members: [user.id],
      });
      console.log('channel->', channel);
      await channel.watch();
      setChannel(channel);
      setClient(chatClient);
    }
    init();
    if (client) return () => client.disconnectUser();
    return () => {
      init();
    };
  }, []);

  if (!client || !channel) {
    return <LoadingIndicator />;
  }

  return (
    <>
      <Chat client={client} theme={'messaging light'}>
        <Channel channel={channel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
        </Channel>
      </Chat>
    </>
  );
};

export default ChatStream;
