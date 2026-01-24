
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
