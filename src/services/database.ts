
import { supabase } from '../supabaseClient';
import type { InvitationData } from '../types';

/**
 * Saves the invitation data to Supabase Database.
 * Returns the UUID of the inserted/updated record.
 */
export const saveInvitationToDb = async (data: InvitationData): Promise<string> => {
    try {
        const { data: inserted, error } = await supabase
            .from('invitations')
            .insert([
                { data: data }
            ])
            .select('id')
            .single();

        if (error) throw error;
        return inserted.id; // Return the UUID
    } catch (error) {
        console.error("Error saving invitation:", error);
        throw new Error("No se pudo guardar la invitación.");
    }
};

/**
 * Fetches invitation data by UUID.
 */
export const getInvitationFromDb = async (id: string): Promise<InvitationData | null> => {
    try {
        const { data, error } = await supabase
            .from('invitations')
            .select('data')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data.data as InvitationData;
    } catch (error) {
        console.error("Error loading invitation:", error);
        return null;
    }
};

/**
 * Updates a specific guest's status and message.
 */
export const updateGuestStatus = async (invitationId: string, guestId: string, status: string, message?: string): Promise<boolean> => {
    try {
        const { getInvitationFromDb } = await import('./database'); // Self-import to use the existing getter
        // 1. Get current data
        const currentData = await getInvitationFromDb(invitationId);
        if (!currentData || !currentData.guests) return false;

        // 2. Find and update guest
        const updatedGuests = (currentData.guests as any[]).map(g => {
            if (g.id === guestId) {
                return { ...g, status: status, message: message || g.message };
            }
            return g;
        });

        // 3. Update the record
        const { error } = await supabase
            .from('invitations')
            .update({ data: { ...currentData, guests: updatedGuests } })
            .eq('id', invitationId);

        if (error) throw error;
        return true;
    } catch (error) {
        console.error("Error updating guest status:", error);
        return false;
    }
};
