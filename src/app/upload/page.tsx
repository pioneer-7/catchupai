'use client';

// 업로드 페이지 — 드래그존 + lucide 아이콘
// SSOT: specs/002-ux/ia-and-screens.md 섹션 2.2

import { useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Download } from 'lucide-react';

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
      if (json.success) { setCsvStatus('success'); setCsvResult(json.data); }
      else { setCsvStatus('error'); setErrorMsg(json.error?.message || '업로드 실패'); }
    } catch { setCsvStatus('error'); setErrorMsg('업로드 처리 중 오류가 발생했습니다'); }
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
      if (json.success) { setMaterialStatus('success'); setMaterialResult(json.data); }
      else { setMaterialStatus('error'); setErrorMsg(json.error?.message || '업로드 실패'); }
    } catch { setMaterialStatus('error'); setErrorMsg('업로드 처리 중 오류가 발생했습니다'); }
  }

  async function handleSampleLoad() {
    setCsvStatus('uploading');
    try {
      const res = await fetch('/api/upload/sample', { method: 'POST' });
      const json = await res.json();
      if (json.success) { setCsvStatus('success'); setCsvResult(json.data); }
    } catch { setCsvStatus('error'); }
  }

  const anySuccess = csvStatus === 'success' || materialStatus === 'success';

  return (
    <main className="flex-1 px-6 py-12 max-w-4xl mx-auto w-full">
      <h1 className="text-2xl heading-md mb-2">데이터 업로드</h1>
      <p className="text-[var(--text-secondary)] text-sm mb-8">강의자료와 학생 데이터를 업로드하여 분석을 시작하세요.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* CSV Upload */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--tint-blue)' }}>
              <Upload size={18} style={{ color: 'var(--tint-blue-text)' }} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-[15px]" style={{ fontWeight: 510 }}>학생 데이터 (CSV)</h2>
              <p className="text-xs text-[var(--text-muted)]">출결, 과제, 퀴즈 데이터</p>
            </div>
          </div>

          {/* Drag zone */}
          <label className={`block border-2 border-dashed rounded-[var(--radius-card)] p-6 text-center cursor-pointer transition-all mb-4 ${
            csvFile ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-warm)]'
          }`}>
            <input type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] || null)} className="hidden" />
            {csvFile ? (
              <div className="flex items-center justify-center gap-2 text-[var(--accent)]">
                <FileText size={18} strokeWidth={1.8} />
                <span className="text-sm" style={{ fontWeight: 510 }}>{csvFile.name}</span>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto text-[var(--text-muted)] mb-2" strokeWidth={1.5} />
                <p className="text-sm text-[var(--text-secondary)]">CSV 파일을 선택하세요</p>
              </>
            )}
          </label>

          <a href="/sample/template.csv" download className="inline-flex items-center gap-1 text-xs text-[var(--accent)] mb-4 hover:underline" style={{ fontWeight: 510 }}>
            <Download size={12} /> CSV 템플릿 다운로드
          </a>

          <button onClick={handleCsvUpload} disabled={!csvFile || csvStatus === 'uploading'} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {csvStatus === 'uploading' ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin" />업로드 중...</span> : 'CSV 업로드'}
          </button>

          {csvStatus === 'success' && csvResult && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--status-stable)]" style={{ fontWeight: 510 }}>
              <CheckCircle size={15} /> {csvResult.processed}명 처리 완료
            </div>
          )}
          {csvStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--status-risk)]" style={{ fontWeight: 510 }}>
              <AlertCircle size={15} /> {errorMsg}
            </div>
          )}
        </div>

        {/* Material Upload */}
        <div className="card p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--tint-purple)' }}>
              <FileText size={18} style={{ color: 'var(--tint-purple-text)' }} strokeWidth={1.8} />
            </div>
            <div>
              <h2 className="text-[15px]" style={{ fontWeight: 510 }}>강의자료</h2>
              <p className="text-xs text-[var(--text-muted)]">PDF 또는 텍스트 파일</p>
            </div>
          </div>

          <label className={`block border-2 border-dashed rounded-[var(--radius-card)] p-6 text-center cursor-pointer transition-all mb-4 ${
            materialFile ? 'border-[var(--accent)] bg-[var(--accent-light)]' : 'border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--bg-warm)]'
          }`}>
            <input type="file" accept=".pdf,.txt" onChange={e => setMaterialFile(e.target.files?.[0] || null)} className="hidden" />
            {materialFile ? (
              <div className="flex items-center justify-center gap-2 text-[var(--accent)]">
                <FileText size={18} strokeWidth={1.8} />
                <span className="text-sm" style={{ fontWeight: 510 }}>{materialFile.name}</span>
              </div>
            ) : (
              <>
                <Upload size={24} className="mx-auto text-[var(--text-muted)] mb-2" strokeWidth={1.5} />
                <p className="text-sm text-[var(--text-secondary)]">파일을 선택하세요</p>
              </>
            )}
          </label>

          <button onClick={handleMaterialUpload} disabled={!materialFile || materialStatus === 'uploading'} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            {materialStatus === 'uploading' ? <span className="flex items-center justify-center gap-2"><RefreshCw size={14} className="animate-spin" />업로드 중...</span> : '강의자료 업로드'}
          </button>

          {materialStatus === 'success' && materialResult && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--status-stable)]" style={{ fontWeight: 510 }}>
              <CheckCircle size={15} /> 업로드 완료 ({materialResult.material_length.toLocaleString()}자)
            </div>
          )}
          {materialStatus === 'error' && (
            <div className="mt-3 flex items-center gap-2 text-sm text-[var(--status-risk)]" style={{ fontWeight: 510 }}>
              <AlertCircle size={15} /> {errorMsg}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        {anySuccess && (
          <Link href="/dashboard" className="btn-primary inline-flex items-center gap-2">
            대시보드로 이동 <ArrowRight size={14} />
          </Link>
        )}
        <button onClick={handleSampleLoad} className="btn-secondary">
          또는 샘플 데이터로 시작
        </button>
      </div>
    </main>
  );
}
