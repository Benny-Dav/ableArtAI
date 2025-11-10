import { LucideIcon, LucideProps } from "lucide-react";

interface EditorBoxLayoutProps {
    children: React.ReactNode;
    boxTitle: string;
    headerIcon?: LucideIcon;
    iconProps?: LucideProps;
}
export default function EditorBoxLayout({ children, boxTitle, headerIcon:HeaderIcon, iconProps }: EditorBoxLayoutProps) {
    return (

        <div className="lg:w-full w-full flex flex-col py-4 px-6 gap-8 text-gray-100 border border-gray-500 rounded-xl lg:h-full">
            <header className="flex justify-start items-center gap-2">
                <div className="h-10 w-10 bg-gray-100 rounded-md flex justify-center items-center">{HeaderIcon && <HeaderIcon {...iconProps}/>}</div>
                <p>{boxTitle}</p>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>

    )
}