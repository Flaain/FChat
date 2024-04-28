export const AuthContainer = ({ children }: { children: React.ReactNode }) => (
    <div className='flex max-md:justify-center flex-1 max-sm:px-5 px-10 max-lg:px-5 md:border-l md:border-solid md:border-primary-dark-50 md:h-full'>
        {children}
    </div>
);