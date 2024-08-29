import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonToast,
} from '@ionic/react';
import { supabase } from '../../supabaseClient';
import { addOutline, trashOutline, createOutline, colorFill } from 'ionicons/icons';

const Tags: React.FC = () => {
  const [tags, setTags] = useState<any[]>([]);
  const [newTagTitle, setNewTagTitle] = useState<string>('');
  const [newTagColor, setNewTagColor] = useState<string>('#ffffff');
  const [showToast, setShowToast] = useState<{ show: boolean; message: string; color: string }>({
    show: false,
    message: '',
    color: 'primary',
  });

  useEffect(() => {
    const fetchTags = async () => {
      const { data, error } = await supabase.from('tags').select('*');
      if (error) {
        console.error('Error fetching tags:', error.message);
      } else {
        setTags(data);
      }
    };

    fetchTags();
  }, []);

  const handleAddTag = async () => {
    if (!newTagTitle) {
      setShowToast({ show: true, message: 'Tag title cannot be empty.', color: 'danger' });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser()

    const tag = {
        user_id: user ? user.id : null,
        name: newTagTitle,
        color: newTagColor,
    };

    try {
      const { data, error } = await supabase
        .from('tags')
        .insert([tag])
        .select();
      
      if (error) throw error;

      setTags([...tags, data[0]]);
      setNewTagTitle('');
      setNewTagColor('#ffffff');
      setShowToast({ show: true, message: 'Tag added successfully!', color: 'success' });
    } catch (error: any) {
      console.error('Error adding tag:', error.message);
      setShowToast({ show: true, message: 'Failed to add tag.', color: 'danger' });
    }
  };

  const handleDeleteTag = async (tagId: number) => {
    try {
      const { error } = await supabase
        .from('tags')
        .delete()
        .eq('tag_id', tagId);
      
      if (error) throw error;

      setTags(tags.filter(tag => tag.tag_id !== tagId));
      setShowToast({ show: true, message: 'Tag deleted successfully!', color: 'success' });
    } catch (error: any) {
      console.error('Error deleting tag:', error.message);
      setShowToast({ show: true, message: 'Failed to delete tag.', color: 'danger' });
    }
  };

  const handleUpdateTag = async (tagId: number, updatedTitle: string, updatedColor: string) => {
    try {
      const { data, error } = await supabase
        .from('tags')
        .update({ name: updatedTitle, color: updatedColor })
        .eq('tag_id', tagId);
      
      if (error) throw error;

      setTags(tags.map(tag => (tag.tag_id === tagId ? data[0] : tag)));
      setShowToast({ show: true, message: 'Tag updated successfully!', color: 'success' });
    } catch (error: any) {
      console.error('Error updating tag:', error.message);
      setShowToast({ show: true, message: 'Failed to update tag.', color: 'danger' });
    }
  };

  return (
    <IonPage>
      <IonContent>
        <IonList>
          {tags.map(tag => (
            <IonItemSliding key={tag.tag_id}>
              <IonItem>
                <IonLabel color={tag.color} style={{ color: tag.color }}>
                  {tag.name}
                </IonLabel>
                <IonIcon icon={createOutline} slot="end" onClick={() => handleUpdateTag(tag.tag_id, tag.name, tag.color)} />
              </IonItem>
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => handleDeleteTag(tag.tag_id)}>
                  <IonIcon icon={trashOutline} slot="icon-only" />
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <IonItem>
          <IonInput
            value={newTagTitle}
            placeholder="New Tag Title"
            onIonChange={e => setNewTagTitle(e.detail.value!)}
            color={'secondary'}
          />
          <IonInput
            type="text"
            value={newTagColor}
            onIonChange={e => setNewTagColor(e.detail.value!)}
            color={'secondary'}
          />
          <IonButton onClick={handleAddTag}>
            <IonIcon slot="icon-only" icon={addOutline} />
          </IonButton>
        </IonItem>
        <IonToast
          isOpen={showToast.show}
          message={showToast.message}
          color={showToast.color}
          duration={2000}
          onDidDismiss={() => setShowToast({ show: false, message: '', color: 'primary' })}
        />
      </IonContent>
    </IonPage>
  );
};

export default Tags;
