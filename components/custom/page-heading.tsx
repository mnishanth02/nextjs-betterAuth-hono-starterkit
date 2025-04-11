interface PageHeadingProps {
  title: string;
  description: string;
}

const PageHeading = ({ title, description }: PageHeadingProps) => {
  return (
    <div className="flex flex-col">
      <div className="h3">{title}</div>
      <div className="subtitle">{description}</div>
    </div>
  );
};

export default PageHeading;
