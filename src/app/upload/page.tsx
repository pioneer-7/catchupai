'use client';

// 업로드 페이지 — SSOT: specs/002-ux/ia-and-screens.md 섹션 2.2

import { useState } from 'react';
import Link from 'next/link';

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export default function UploadPage() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [materialFile, setMaterialFile] = useState<File | null>(null);
  const [csvStatus, setCsvStatus] = useState<UploadStatus>('idle');
  const [materialStatus, setMaterialStatus] = useState<UploadStatus>('idle');
  const [csvResult, setCsvResult] = useState<{ total_rows: number; processed: number; skipped: number } | null>(null);
  const [materialResult, setMaterialResult] = useState<{ material_length: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleCsvUpload() {
    if (!csvFile) return;
    setCsvStatus('uploading');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', csvFile);
      const res = await fetch('/api/upload/students', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        setCsvStatus('success');
        setCsvResult(json.data);
      } else {
        setCsvStatus('error');
        setErrorMsg(json.error?.message || '업로드 실패');
      }
    } catch {
      setCsvStatus('error');
      setErrorMsg('업로드 처리 중 오류가 발생했습니다');
    }
  }

  async function handleMaterialUpload() {
    if (!materialFile) return;
    setMaterialStatus('uploading');
    setErrorMsg('');
    try {
      const formData = new FormData();
      formData.append('file', materialFile);
      const res = await fetch('/api/upload/material', { method: 'POST', body: formData });
      const json = await res.json();
      if (json.success) {
        setMaterialStatus('success');
        setMaterialResult(json.data);
      } else {
        setMaterialStatus('error');
        setErrorMsg(json.error?.message || '업로드 실패');
      }
    } catch {
      setMaterialStatus('error');
      setErrorMsg('업로드 처리 중 오류가 발생했습니다');
    }
  }

  async function handleSampleLoad() {
    setCsvStatus('uploading');
    try {
      const res = await fetch('/api/upload/sample', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        setCsvStatus('success');
        setCsvResult(json.data);
      }
    } catch {
      setCsvStatus('error');
    }
  }

  const anySuccess = csvStatus === 'success' || materialStatus === 'success';

  return (
    <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl font-bold tracking-tight mb-2">데이터 업로드</h1>
      <p className="text-[var(--text-secondary)] mb-8">강의자료와 학생 데이터를 업로드하세요</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* CSV Upload Card */}
        <div className="card p-8">
          <h2 className="text-lg heading-md mb-2">학생 데이터 (CSV)</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-2">
            학생별 출결, 과제, 퀴즈 데이터가 포함된 CSV 파일
          </p>
          <a
            href="/sample/template.csv"
            download
            className="inline-block text-xs text-[var(--accent)] font-semibold hover:underline mb-4"
          >
            CSV 템플릿 다운로드 →
          </a>
          <input
            type="file"
            accept=".csv"
            onChange={e => setCsvFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-[#615d59] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f6f5f4] file:text-black/95 hover:file:bg-black/10 mb-4"
          />
          <button
            onClick={handleCsvUpload}
            disabled={!csvFile || csvStatus === 'uploading'}
            className="w-full px-4 py-2.5 bg-[var(--accent)] text-white rounded font-semibold hover:bg-[var(--accent-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {csvStatus === 'uploading' ? '업로드 중...' : 'CSV 업로드'}
          </button>
          {csvStatus === 'success' && csvResult && (
            <p className="mt-3 text-sm text-[var(--status-stable)] font-medium">
              {csvResult.processed}명 처리 완료
              {csvResult.skipped > 0 && ` (${csvResult.skipped}건 건너뜀)`}
            </p>
          )}
          {csvStatus === 'error' && (
            <p className="mt-3 text-sm text-[var(--status-risk)] font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Material Upload Card */}
        <div className="card p-8">
          <h2 className="text-lg heading-md mb-2">강의자료</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            PDF 또는 텍스트 파일로 강의자료를 업로드하세요
          </p>
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={e => setMaterialFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-[#615d59] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#f6f5f4] file:text-black/95 hover:file:bg-black/10 mb-4"
          />
          <button
            onClick={handleMaterialUpload}
            disabled={!materialFile || materialStatus === 'uploading'}
            className="w-full px-4 py-2.5 bg-[var(--accent)] text-white rounded font-semibold hover:bg-[var(--accent-hover)] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {materialStatus === 'uploading' ? '업로드 중...' : '강의자료 업로드'}
          </button>
          {materialStatus === 'success' && materialResult && (
            <p className="mt-3 text-sm text-[var(--status-stable)] font-medium">
              업로드 완료 ({materialResult.material_length.toLocaleString()}자)
            </p>
          )}
          {materialStatus === 'error' && (
            <p className="mt-3 text-sm text-[var(--status-risk)] font-medium">{errorMsg}</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4">
        {anySuccess && (
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-[var(--accent)] text-white rounded font-semibold hover:bg-[var(--accent-hover)] transition"
          >
            대시보드로 이동
          </Link>
        )}
        <button
          onClick={handleSampleLoad}
          className="px-6 py-3 rounded font-semibold bg-black/5 text-black/95 hover:bg-black/10 transition"
        >
          또는 샘플 데이터로 시작
        </button>
      </div>
    </main>
  );
}
