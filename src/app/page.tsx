// src/app/page.tsx
'use client'; // nécessaire si vous utilisez useRouter()

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/dashboard');
    }, [router]);

    return <div>Redirecting to Dashboard…</div>;
}