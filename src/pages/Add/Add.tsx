import { IonContent, IonDatetime, IonSegment, IonPage, IonSegmentButton, IonToolbar, IonLabel, IonInput, IonButton, IonSelect, IonSelectOption, IonText, IonDatetimeButton, IonModal, IonCheckbox, IonList, IonItemDivider, IonHeader, IonTitle, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import { format, toZonedTime } from 'date-fns-tz';


import './Add.css'

const Add: React.FC = () => {
    const [type, setType] = useState<string>('task');
    const [name, setName] = useState<string>('');
    const [startDate, setStartDate] = useState<string>(new Date().toISOString());
    const [endDate, setEndDate] = useState<string>(new Date().toISOString());
    const [startTime, setStartTime] = useState<string>(new Date().toISOString());
    const [endTime, setEndTime] = useState<string>(new Date().toISOString());
    const [occursOn, setOccursOn] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    
    const [showDateInput, setShowDateInput] = useState<boolean>(false);
    const [showTimeInputs, setShowTimeInputs] = useState<boolean>(false);

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const tagSelect = {
        color: 'tertiary',
        cssClass: 'tagSelectInterface'
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const { data: { user } } = await supabase.auth.getUser()

        function parseISOString(s: string): Date {
            const [year, month, day, hour, minute, second, millisecond] = s.split(/\D+/).map(Number);
            return new Date(year, month - 1, day, hour, minute, second, millisecond || 0);
        }
        
        function extractTime(isoString: string | null, userTimeZone: string): string | null {
            if (!isoString) return null;
            
            const date = parseISOString(isoString);
            const zonedTime = toZonedTime(date, userTimeZone);
            
            return format(zonedTime, "HH:mm:ssXXX", { timeZone: userTimeZone });
        }

        const item = {
            user_id: user ? user.id : null,
            type,
            name,
            start_date: type !== 'routine' && showDateInput ? startDate : null,
            end_date: type === 'routine' ? endDate : null,
            start_time: type !== 'event' && showTimeInputs ? extractTime(startTime, userTimeZone) : null,
            end_time: type !== 'event' && showTimeInputs ? extractTime(endTime, userTimeZone) : null,
            occurs_on: type === 'routine' ? occursOn.join(',') : null,
            completed: false,
        };

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
            <IonHeader className='ion-no-border'>
                <IonToolbar className='mainToolbar'>
                    <IonTitle className='mainTitle'>Add</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className='addContent'>
                <div className='addFormDiv'>
                    <form className="addForm" onSubmit={handleSubmit}>
                        <div className='typeSegmentDiv'>
                            <IonSegment mode='ios' value={type} onIonChange={e => setType(e.detail.value! as string)} className='typeSegment'>
                                <IonSegmentButton className='typeSegmentButton' value="task">Task</IonSegmentButton>
                                <IonSegmentButton className='typeSegmentButton' value="event">Event</IonSegmentButton>
                                <IonSegmentButton className='typeSegmentButton' value="routine">Routine</IonSegmentButton>
                            </IonSegment>
                        </div>

                        <IonInput 
                            value={name} 
                            onIonChange={e => setName(e.detail.value!)} 
                            fill='outline' 
                            labelPlacement='floating' 
                            mode='md' 
                            required 
                            className='nameInput'
                            color={'tertiary'}>
                            <div slot='label'>
                                <IonText color={'tertiary'}>Name</IonText>
                            </div>
                        </IonInput>

                        {(type === 'task' || type === 'event') && !showDateInput && (
                            <IonButton fill="outline" color={'tertiary'} onClick={() => setShowDateInput(true)} expand="block" className='addDateButton'>Set Date</IonButton>
                        )}

                        {(type === 'task' || type === 'event') && showDateInput && (
                            <>
                                <div className='dateSelectorDiv'>
                                    <IonLabel className='startDateLabel'>Date</IonLabel>
                                    <IonDatetimeButton datetime="start-date">
                                        <IonText>{startDate ? 'SomeDate' : 'Select Date'}</IonText>
                                    </IonDatetimeButton>
                                    <IonModal keepContentsMounted={true}>
                                        <IonDatetime
                                            id="start-date"
                                            presentation="date"
                                            preferWheel={true}
                                            value={startDate}
                                            onIonChange={e => setStartDate(e.detail.value! as string)}
                                        />
                                    </IonModal>
                                </div>
                                <IonButton fill="outline" color={'tertiary'} onClick={() => setShowDateInput(false)} expand="block" className='addDateButton'>Remove Date</IonButton>
                            </>
                        )}

                        {type === 'routine' && (
                            <div className='occurDiv'>
                                <div className='occurLabel'>
                                    <IonText>Occurs On</IonText>
                                </div>
                                <IonGrid>
                                    <IonRow>
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                                            <IonCol key={index} style={{ textAlign: 'center' }}>
                                                <IonCheckbox color={'tertiary'} labelPlacement="stacked" checked={occursOn.includes(day)} onIonChange={e => {
                                                    const checked = e.detail.checked;
                                                    const fullDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index];
                                                    setOccursOn(prev => checked ? [...prev, fullDay] : prev.filter(d => d !== fullDay));
                                                }}>{day}</IonCheckbox>
                                            </IonCol>
                                        ))}
                                    </IonRow>
                                </IonGrid>
                            </div>
                        )}

                        {(type === 'task' || type === 'routine') && !showTimeInputs && (
                            <IonButton fill="outline" color={'tertiary'} onClick={() => setShowTimeInputs(true)} expand="block" className='addTimeButton'>Set Time</IonButton>
                        )}

                        {showTimeInputs && (
                            <>
                                <div className='timeSelectorDiv'>
                                    <div className='startTimeDiv'>
                                        <IonLabel className='startTimeLabel'>Start Time</IonLabel>
                                        <IonDatetimeButton datetime="start-time" />
                                        <IonModal keepContentsMounted={true}>
                                            <IonDatetime
                                                id="start-time"
                                                presentation='time'
                                                minuteValues="0,30"
                                                value={startTime}
                                                onIonChange={e => setStartTime(e.detail.value! as string)}
                                            />
                                        </IonModal>
                                    </div>
                                    <div className='endTimeDiv'>
                                        <IonLabel className='endTimeLabel'>End Time</IonLabel>
                                        <IonDatetimeButton datetime="end-time" />
                                        <IonModal keepContentsMounted={true}>
                                            <IonDatetime
                                                id="end-time"
                                                presentation='time'
                                                minuteValues="0,30"
                                                value={endTime}
                                                onIonChange={e => setEndTime(e.detail.value! as string)}
                                            />
                                        </IonModal>
                                    </div>
                                </div>
                                <IonButton fill="outline" color={'tertiary'} onClick={() => setShowTimeInputs(false)} expand="block" className='addTimeButton'>Remove Time</IonButton>
                            </>
                        )}

                        <div className='tagSelectField'>
                            <IonSelect color={'tertiary'} interface='alert' interfaceOptions={tagSelect} multiple={true} value={tags} onIonChange={e => setTags(e.detail.value)}>
                                {/* TODO: Replace with dynamic tags from the database */}
                                <div slot='label'>
                                    Tags
                                </div>
                                <IonSelectOption className='tagSelectOption' value="tag1">Tag 1</IonSelectOption>
                                <IonSelectOption className='tagSelectOption' value="tag2">Tag 2</IonSelectOption>
                            </IonSelect>
                        </div>

                        <IonButton fill='solid' color={'tertiary'} type="submit" expand="block" className='confirmAddButton'>
                            <IonText color={'primary'}>Confirm Add</IonText>
                        </IonButton>
                    </form>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Add;
