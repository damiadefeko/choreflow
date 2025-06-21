import { Label } from './ui/label';
import { Button } from './Button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import type { Chore } from '@/store/slices/choresSlice';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createPortal } from 'react-dom';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import closeIcon from '@/assets/icons/close.svg';
import { formatDate } from '@/utils/helper';
import { useAppSelector } from '@/store/hooks';

interface AssigneeItemProps {
    name: string;
    onDelete(name: string): void;
}
function AssigneeItem(props: AssigneeItemProps) {
    return (
        <div>
            <div className='flex justify-between'>
                <div className='text-sm'>{props.name}</div>
                <button className='cursor-pointer' onClick={() => props.onDelete(props.name)}>
                    <img src={closeIcon} />
                </button>
            </div>
            <Separator className='my-2' />
        </div>
    );
}

interface ChoreModal {
    isAdmin: boolean;
    chore: Chore;
    onClose(): void;
}

export function ChoreModal(props: ChoreModal) {
    const allFamilyMembers = props.chore.choreWeek.family.members;
    const isAdmin = useAppSelector((state) => state.user.isAdmin);

    const [choreName, setChoreName] = useState(props.chore.choreName);
    const [choreDescription, setChoreDescription] = useState(props.chore.choreDescription);
    const [chorePoints, setChorePoints] = useState(props.chore.chorePoints);
    const [choreDeadline, setChoreDeadline] = useState(formatDate(props.chore.choreDeadline));
    const [choreAssigness, setChoreAssigness] = useState(props.chore.assignees);

    const [submissionStatus, setSubmissionStatus] = useState(false);

    function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        props.onClose();
    }

    function handleAssigneeDelete(assigneeName: string) {
        setChoreAssigness((prevAssignees) => prevAssignees?.filter((assignee) => assignee.email !== assigneeName));
    }

    function handleNewAssignee(assigneeEmail: string) {
        const member = allFamilyMembers.find((member) => member.email === assigneeEmail);
        if (!member) {
            return;
        }
        let isDuplicate = false;
        // Search if the assignee is already present
        choreAssigness?.forEach((assignee) => {
            if (assignee.email === member?.email) {
                isDuplicate = true;
            }
        });

        if (isDuplicate) {
            return;
        }

        setChoreAssigness((prevAssignees) => (prevAssignees ? [...prevAssignees, member] : [member]));
    }
    return createPortal(
        <Card className='w-full max-w-sm py-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50'>
            <CardHeader>
                <CardTitle className='text-center'>{choreName}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className='flex flex-col gap-8'>
                        <div className='grid gap-2'>
                            <Label htmlFor='choreName'>Chore Name</Label>
                            <Input
                                id='choreName'
                                type='text'
                                placeholder='Clean Dishes'
                                value={choreName}
                                onChange={(e) => setChoreName(e.target.value)}
                                required
                                disabled={!isAdmin}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label htmlFor='choreDescription'>Description</Label>
                            </div>
                            <Textarea
                                id='choreDescription'
                                value={choreDescription}
                                onChange={(e) => setChoreDescription(e.target.value)}
                                required
                                disabled={!isAdmin}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label htmlFor='chorePoints'>Points</Label>
                            </div>
                            <Input
                                id='chorePoints'
                                type='number'
                                value={chorePoints}
                                onChange={(e) => setChorePoints(parseInt(e.target.value))}
                                required
                                disabled={!isAdmin}
                            />
                        </div>
                        <div className='grid gap-2'>
                            <div className='flex items-center'>
                                <Label htmlFor='choreDueDate'>Due Date</Label>
                            </div>
                            <Input
                                id='choreDeadline'
                                type='date'
                                value={choreDeadline}
                                onChange={(e) => setChoreDeadline(e.target.value)}
                                required
                                disabled={!isAdmin}
                            />
                        </div>
                        {isAdmin && (
                            <div className='grid gap-2'>
                                <div className='flex items-center'>
                                    <Label htmlFor='assignees'>New assignee</Label>
                                </div>
                                <Select onValueChange={(value) => handleNewAssignee(value)}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Family member' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {allFamilyMembers.map((member) => (
                                            <SelectItem key={member.email} value={member.email}>
                                                {member.email}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        {isAdmin && (
                            <div className='grid gap-2'>
                                <ScrollArea className='h-[150px] w-full rounded-md border'>
                                    <div className='p-4'>
                                        <h4 className='mb-4 text-sm leading-none font-medium'>Assignees</h4>
                                        {choreAssigness?.map((assignee) => (
                                            <AssigneeItem
                                                key={assignee.email}
                                                name={assignee.email}
                                                onDelete={handleAssigneeDelete}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            </div>
                        )}
                    </div>
                    <div className='flex gap-2 justify-between mt-6'>
                        <Button size='default' text='Close' onClick={props.onClose} additionalClasses='!w-full' />
                        {isAdmin && (
                            <Button
                                size='default'
                                text={submissionStatus ? 'Saving...' : 'Save changes'}
                                disabled={submissionStatus}
                                onClick={props.onClose}
                            />
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>,
        document.getElementById('modals') as any
    );
}
