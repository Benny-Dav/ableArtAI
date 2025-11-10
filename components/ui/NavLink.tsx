
import { useRouter } from "next/router";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export default function NavLink({ href, children, isActive }: NavLinkProps) {
    const router = useRouter();
    
    const active = router.pathname === href;
    
    return (
        <a href={href} className={active ? 'active' : ''}>
            {children}
        </a>
    );
}