import LKNavBar from "@/src/components/LKNavBar"
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <LKNavBar />
            {children}
        </>
    )
}