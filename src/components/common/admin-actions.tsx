'use client';

import { Button } from '@/components/common/button';
import { useAuth } from '@/hooks/use-auth';
import { ui } from '@/lib/ui';

type AdminActionsProps = {
  collectionLabel: string;
  endpoint: string;
  itemId?: string;
  createTemplate?: Record<string, unknown>;
  updateTemplate?: Record<string, unknown>;
  canCreate?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
};

function toPrettyJson(value: Record<string, unknown>) {
  return JSON.stringify(value, null, 2);
}

export function AdminActions({
  collectionLabel,
  canCreate = true,
  canDelete = true,
  canUpdate = true,
  createTemplate = {},
  endpoint,
  itemId,
  updateTemplate = {},
}: AdminActionsProps) {
  const { getIdToken, isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  async function requestAdminAction(method: 'POST' | 'PATCH' | 'DELETE', url: string, body?: unknown) {
    const token = await getIdToken();
    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      window.alert(String(error.message ?? '관리자 작업에 실패했습니다.'));
      return;
    }

    window.location.reload();
  }

  async function handleCreate() {
    const input = window.prompt(`${collectionLabel} 추가 JSON`, toPrettyJson(createTemplate));
    if (!input) return;

    try {
      await requestAdminAction('POST', endpoint, JSON.parse(input));
    } catch {
      window.alert('JSON 형식이 올바르지 않습니다.');
    }
  }

  async function handleUpdate() {
    if (!itemId) return;
    const input = window.prompt(`${collectionLabel} 수정 JSON`, toPrettyJson(updateTemplate));
    if (!input) return;

    try {
      await requestAdminAction('PATCH', `${endpoint}/${itemId}`, JSON.parse(input));
    } catch {
      window.alert('JSON 형식이 올바르지 않습니다.');
    }
  }

  async function handleDelete() {
    if (!itemId) return;
    if (!window.confirm(`${collectionLabel} 항목을 삭제할까요?`)) return;

    await requestAdminAction('DELETE', `${endpoint}/${itemId}`);
  }

  return (
    <div className="admin-actions">
      <span className={ui.badgeWarm}>관리자</span>
      {canCreate ? (
        <Button type="button" className="admin-actions__button" onClick={handleCreate}>
          추가
        </Button>
      ) : null}
      {itemId ? (
        <>
          {canUpdate ? (
            <Button type="button" className="admin-actions__button" onClick={handleUpdate}>
              수정
            </Button>
          ) : null}
          {canDelete ? (
            <Button type="button" className="admin-actions__button" onClick={handleDelete}>
              삭제
            </Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
