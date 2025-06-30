// src/components/Footer.tsx
import React from "react";
import { Mountain, Twitter, Github, Linkedin } from "lucide-react";

// Tái sử dụng component NavLink từ Header hoặc tạo riêng
const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
  >
    {children}
  </a>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted/40 border-t">
      <div className="container grid items-center gap-8 px-4 py-12 md:grid-cols-2 lg:grid-cols-3 md:px-6">
        {/* Phần Logo và Copyright */}
        <div className="flex flex-col items-start gap-2">
          <a href="/" className="flex items-center gap-2 mb-2">
            <Mountain className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg">MyApp</span>
          </a>
          <p className="text-sm text-muted-foreground">
            © {currentYear} MyApp Inc. All rights reserved.
          </p>
        </div>

        {/* Phần Link điều hướng */}
        <div className="grid gap-4 text-center md:text-left">
          <h3 className="font-semibold tracking-wide">Navigate</h3>
          <div className="grid gap-2">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
            <FooterLink href="/terms">Terms of Service</FooterLink>
            <FooterLink href="/privacy">Privacy Policy</FooterLink>
          </div>
        </div>

        {/* Phần Social Media */}
        <div className="flex items-center justify-center md:justify-end gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Twitter"
          >
            <Twitter className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <Github className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-6 w-6 text-muted-foreground transition-colors hover:text-primary" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
