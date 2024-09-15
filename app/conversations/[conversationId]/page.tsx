import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages"; // Ensure consistency in import naming
import getUsers from "@/actions/getUsers";
import Body from "@/components/messenger/Body";
import EmptyState from "@/components/messenger/EmptyState";
import Form from "@/components/messenger/Form";
import Header from "@/components/messenger/Header";

// Define IParams interface for route parameters
interface IParams {
  conversationId: string;
}

// Async function for handling conversation page
const ConversationId = async ({ params }: { params: IParams }) => {
  // Fetch the conversation and messages based on the conversationId
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);
  const users = await getUsers();

  // If no conversation is found, render the EmptyState component
  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  // If the conversation is found, render the conversation UI
  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header users={users} conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
};

export default ConversationId;
