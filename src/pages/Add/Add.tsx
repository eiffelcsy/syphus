import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonItem, IonDatetime, IonCheckbox, IonList, IonItemDivider } from '@ionic/react';
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';

const Add: React.FC = () => {
    const [type, setType] = useState<string>('task');
    const [name, setName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [occursOn, setOccursOn] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser()

        function extractTime(isoString: string) {
            if (!isoString) return null;
            const date = new Date(isoString);
            return date.toISOString().substring(11, 19);
        }

        const item = {
            user_id: user ? user.id : null,
            type,
            name,
            start_date: type !== 'routine' ? startDate : null,
            end_date: type === 'routine' ? endDate : null,
            start_time: type !== 'event' ? extractTime(startTime) : null,
            end_time: type !== 'event' ? extractTime(endTime) : null,
            occurs_on: type === 'routine' ? occursOn.join(',') : null,
        };

        console.log(item)

        try {
            const { data, error } = await supabase
                .from('items')
                .insert([item])
                .select();

            if (error) throw error;

            const itemId = data[0].item_id;

            if (tags.length > 0) {
                const itemTags = tags.map(tagId => ({ item_id: itemId, tag_id: tagId }));
                const { error: tagError } = await supabase
                    .from('item_tags')
                    .insert(itemTags);

                if (tagError) throw tagError;
            }

            alert('Item added successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to add item.');
        }
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <form onSubmit={handleSubmit}>
                    <IonItem>
                        <IonLabel>Type</IonLabel>
                        <IonSelect value={type} onIonChange={e => setType(e.detail.value)}>
                            <IonSelectOption value="task">Task</IonSelectOption>
                            <IonSelectOption value="event">Event</IonSelectOption>
                            <IonSelectOption value="routine">Routine</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonItem>
                        <IonLabel>Name</IonLabel>
                        <IonInput value={name} onIonChange={e => setName(e.detail.value!)} required />
                    </IonItem>

                    {(type === 'task' || type === 'event') && (
                        <IonItem>
                            <IonLabel>Date</IonLabel>
                            <IonDatetime presentation="date" preferWheel={true} value={startDate} onIonChange={e => setStartDate(e.detail.value! as string)} />
                        </IonItem>
                    )}

                    {(type === 'task' || type === 'routine') && (
                        <>
                            <IonItem>
                                <IonLabel>Start Time</IonLabel>
                                <IonDatetime presentation='time' minuteValues="0,30" value={startTime} onIonChange={e => setStartTime(e.detail.value! as string)} />
                            </IonItem>
                            <IonItem>
                                <IonLabel>End Time</IonLabel>
                                <IonDatetime presentation='time' minuteValues="0,30" value={endTime} onIonChange={e => setEndTime(e.detail.value! as string)} />
                            </IonItem>
                        </>
                    )}

                    {type === 'routine' && (
                        <IonList>
                            <IonItemDivider>Occurs On</IonItemDivider>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{day}</IonLabel>
                                    <IonCheckbox checked={occursOn.includes(day)} onIonChange={e => {
                                        const checked = e.detail.checked;
                                        setOccursOn(prev => checked ? [...prev, day] : prev.filter(d => d !== day));
                                    }} />
                                </IonItem>
                            ))}
                        </IonList>
                    )}

                    <IonItem>
                        <IonLabel>Tags</IonLabel>
                        <IonSelect multiple={true} value={tags} onIonChange={e => setTags(e.detail.value)}>
                            {/* TODO: Replace with dynamic tags from the database */}
                            <IonSelectOption value="tag1">Tag 1</IonSelectOption>
                            <IonSelectOption value="tag2">Tag 2</IonSelectOption>
                        </IonSelect>
                    </IonItem>

                    <IonButton type="submit" expand="block">Add Item</IonButton>
                </form>
            </IonContent>
        </IonPage>
    );
};

export default Add;
