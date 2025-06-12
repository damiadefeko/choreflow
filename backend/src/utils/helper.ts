export function generateInviteId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let inviteId = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        inviteId += characters[randomIndex];
    }
    return inviteId;
}

export function getStartOfWeek(): Date {
    const currentDate = new Date();
    const diff = currentDate.getDate() - currentDate.getDay() + 1;
    // Set the date to the first day of the week (Monday)
    return new Date(currentDate.setDate(diff));
}