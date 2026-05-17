import { useEffect, useState } from 'react'
import { getCurrentUser } from '../features/auth/authApi'
import CadetCabinetPage from './CadetCabinetPage'
import InstructorCabinetPage from './InstructorCabinetPage'

function isCadetRole(role: string) {
    return role === 'CADET' || role === 'COMBAT MEDIC'
}

export default function ProfilePage() {
    const [role, setRole] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getCurrentUser()
            .then((user) => {
                setRole(user.role)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    if (loading) {
        return <p className="text-zinc-300">Loading profile...</p>
    }

    if (isCadetRole(role)) {
        return <CadetCabinetPage />
    }

    return <InstructorCabinetPage />
}