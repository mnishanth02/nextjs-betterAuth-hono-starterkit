const Footer = () => {
  return (
    <footer>
      <div className="container mx-auto py-4">
        <div className="pt-5 text-center text-sm">
          <p className="text-xs">Build with ❤️ by Nishanth Murugan</p>
          <p className="text-muted-foreground text-xs">
            © {new Date().getFullYear()} Starter Kit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
