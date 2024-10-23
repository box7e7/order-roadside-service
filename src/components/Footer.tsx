export default function Footer() {
    return (
      <div className="relative bottom-0 bg-slate-200 text-slate-600 w-full h-20 flex items-center justify-center">
        <h1>All rights reserved {new Date().getFullYear()}</h1>
      </div>
    );
  }