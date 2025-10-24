export default function Thanks() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl rounded-2xl border bg-white p-8 text-center shadow-sm">
        <h1 className="text-3xl font-bold">Thank you for your purchase! 🎉</h1>
        <p className="mt-3 text-gray-600">Your full plan is on its way to your email within a few minutes.</p>
        <p className="mt-1 text-gray-500 text-sm">Didn’t receive it? Check spam/promotions or contact support.</p>
        <a href="/" className="mt-6 inline-block rounded-xl bg-black text-white px-5 py-3 text-sm font-medium">Back to Home</a>
      </div>
    </div>
  );
}
