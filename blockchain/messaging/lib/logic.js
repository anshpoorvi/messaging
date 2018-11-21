
'use strict';
/**
 * Write your transction processor functions here
 */

/**
 *Create a New message for exchange
 * @param {org.messaging.network.NewMessage} NewMessage
 * @transaction
 */
async function createMessage(NewMessage) {
    var NS = "org.messaging.network";
    var factory= getFactory();
    var message = await factory.newResource(NS,"Message",NewMessage.messageId);
    message.content = NewMessage.content;
    message.subject = NewMessage.subject;
    message.attachment = NewMessage.attachment;
    var assetRegistry = await getAssetRegistry(NS+'.Message');
    await assetRegistry.add(message);
}

/**
 *Create a New User
 * @param {org.messaging.network.NewUser} NewUser
 * @transaction
 */
async function createUser(NewUser) {
    var NS = "org.messaging.network";
    var factory= getFactory();
    var user = await factory.newResource(NS,"User",NewUser.userId);
    user.etherWalletAddress = NewUser.etherWalletAddress;
    user.name = NewUser.name;
    user.email = NewUser.email;
    var userRegistry = await getParticipantRegistry(NS+'.User');
    await userRegistry.add(user);
}


/**
 *Message Exchanges
 * @param {org.messaging.network.MessageExchange} MessageExchange
 * @transaction
 */
async function messageExchange(MessageExchange) {

}
