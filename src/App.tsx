import React from 'react';
import logo from './logo.svg';

function App() {

  const [file, setFile] = React.useState<File | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
    }
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    // Check if the file is a CSV
    if (!file.name.endsWith('.csv')) {
      setError('This is not a CSV file');
      return;
    }

    const formdata = new FormData();
    formdata.append('file', file);

    const response = await fetch(
      "http://localhost:4545/api/csv/v1",
      {
        method: 'POST',
        body: formdata
      }
    )

    if(!response.ok) {
      setError('An error occurred');
      return;
    }

    setError(null);
    setMessage('File uploaded successfully');

  }

  return (
    <main className="w-screen h-screen flex flex-col justify-center items-center">
      <section className="border-2">
        <form className="flex flex-col items-center justify-evenly" onSubmit={onFormSubmit}>
          <input className="w-full self-center" type="file" accept=".csv" onChange={handleFileChange} />
          {error && <p className="text-red-500">{error}</p>}
          <button className="mx-14 my-24">Upload</button>
          {message && <p className="text-green-500">{message}</p>}
        </form>
      </section>
    </main>
  );
}

export default App;
