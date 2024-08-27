'use client'
import FileTree from '@/components/file-tree/file-tree'

export default function SideNav() {

    return (
        <div className="w-full h-full">
            <FileTree initialData={[]} />
        </div>
    );
};

