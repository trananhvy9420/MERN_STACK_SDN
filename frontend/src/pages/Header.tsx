// src/components/Header.tsx
import React from "react";
import { Button } from "@components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Menu, Mountain } from "lucide-react"; // Thêm icon Menu và Mountain

// Tạo một component Link để tái sử dụng, giúp code sạch hơn
const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-foreground/70 transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 ml-10">
          <a href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg inline-block bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              FIFA
            </span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/about">About</NavLink>
            <NavLink href="/contact">Contact</NavLink>
          </nav>
        </div>

        {/* Nhóm bên phải: Nút actions cho desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={() => navigate("/form")}>
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
          <Button
            className="font-semibold bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
            onClick={() => navigate("/register")}
          >
            Register
            <UserPlus className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Menu cho di động (Hamburger Menu) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-6 p-6">
                <a href="/" className="flex items-center gap-2">
                  <Mountain className="h-6 w-6 text-primary" />
                  <span className="font-bold text-lg">MyApp</span>
                </a>
                <nav className="grid gap-4">
                  <NavLink href="/">Home</NavLink>
                  <NavLink href="/about">About</NavLink>
                  <NavLink href="/contact">Contact</NavLink>
                </nav>
                <div className="grid gap-3">
                  <Button variant="ghost" onClick={() => navigate("/form")}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                  <Button
                    className="font-semibold"
                    onClick={() => navigate("/register")}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Register
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
