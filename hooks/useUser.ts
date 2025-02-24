import { updateUserInfo } from "@/scripts/userApi";
import { useState } from "react";
import { User } from "@/models/User";

export const useUser = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUpdateUser = async (fullName: String, username: String, phoneNumber: String, avatar: String) => {
        setLoading(true);
        try {
            const user = await updateUserInfo(fullName, username, phoneNumber, avatar);
            setLoading(false);
            return user ? (JSON.parse(user) as User) : null;
        } catch (err) {
            setLoading(false);
            setError('Failed to update user info');
            throw err;
        }
    }

    return {handleUpdateUser, loading, error};
}
