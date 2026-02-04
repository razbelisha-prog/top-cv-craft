const WorkshopStyleSection = () => {
  return (
    <section className="py-10 bg-background" dir="rtl">
      <div className="container px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex flex-col gap-2">
            <p className="text-xl md:text-2xl font-bold text-foreground">
              זו לא הרצאה.
            </p>
            <p className="text-xl md:text-2xl font-bold text-gradient-primary">
              זו סדנה מעשית.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkshopStyleSection;
