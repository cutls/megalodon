import Entity from './entity';
declare namespace NotificationType {
    const Follow: Entity.NotificationType;
    const Favourite: Entity.NotificationType;
    const Reblog: Entity.NotificationType;
    const Mention: Entity.NotificationType;
    const Poll: Entity.NotificationType;
    const EmojiReaction: Entity.NotificationType;
    const FollowRequest: Entity.NotificationType;
}
export default NotificationType;
