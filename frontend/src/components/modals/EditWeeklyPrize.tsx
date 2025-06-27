import { Label } from '../ui/label';
import { Button } from '../Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { addChore, setChoreWeekPrize, updateChore, type Chore } from '@/store/slices/choresSlice';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createPortal } from 'react-dom';
import { Textarea } from '../ui/textarea';
import { ScrollArea } from '../ui/scroll-area';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/constants';
import { AssigneeItem } from './ChoreModal';
import type { FamilyMember } from '@/store/slices/familySlice';

interface EditWeeklyPrize {
    onClose(): void;
}

export function EditWeeklyPrize(props: EditWeeklyPrize) {
    const choreWeekPrize =
        useAppSelector((state) => state.chores.chores[0]?.choreWeek.weekPrize) || 'Prize of the week';
    const choreWeekId = useAppSelector((state) => state.chores.chores[0]?.choreWeek.id);
    const [weeklyPrizeName, setWeeklyPrizeName] = useState(choreWeekPrize);
    const dispatch = useAppDispatch();

    async function handleFormSubmit(e: React.FormEvent) {
        e.preventDefault();

        dispatch(setChoreWeekPrize({ weekPrize: weeklyPrizeName }));

        props.onClose();

        await axios.put(
            `${API_BASE_URL}/chores/week/${choreWeekId}`,
            { prizeName: weeklyPrizeName },
            { withCredentials: true }
        );
    }

    return createPortal(
        <Card className='w-full max-w-sm py-8 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50'>
            <CardHeader>
                <CardTitle className='text-center'>Edit/Add weekly prize</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={(e) => handleFormSubmit(e)}>
                    <div className='flex flex-col gap-8'>
                        <div className='grid gap-2'>
                            <Label htmlFor='prizeName'>Prize Name</Label>
                            <Input
                                id='prizeName'
                                type='text'
                                placeholder='iPad Pro'
                                value={weeklyPrizeName}
                                onChange={(e) => setWeeklyPrizeName(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 justify-between mt-6'>
                        <Button size='default' text='Close' onClick={props.onClose} />
                        <Button size='default' text='Save changes' />
                    </div>
                </form>
            </CardContent>
        </Card>,
        document.getElementById('modals') as any
    );
}
