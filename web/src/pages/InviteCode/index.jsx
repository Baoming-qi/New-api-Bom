import React, { useEffect, useState } from 'react';
import { Button, Card, InputNumber, Space, Table, Tag } from '@douyinfe/semi-ui';
import { API, showError, showSuccess } from '../../helpers';

const InviteCodePage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [generateCount, setGenerateCount] = useState(5);

  const loadData = async (targetPage = page, targetPageSize = pageSize) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/invite-code/?p=${targetPage}&page_size=${targetPageSize}`);
      const { success, data: payload, message } = res.data;
      if (!success) {
        showError(message);
        return;
      }
      setData(payload.items || []);
      setTotal(payload.total || 0);
      setPage(targetPage);
      setPageSize(targetPageSize);
    } catch {
      showError('加载邀请码失败');
    } finally {
      setLoading(false);
    }
  };

  const generateInviteCodes = async () => {
    setLoading(true);
    try {
      const count = Math.max(1, Math.min(100, Number(generateCount) || 1));
      const res = await API.post('/api/invite-code/generate', { count });
      const { success, message, data: codes } = res.data;
      if (!success) {
        showError(message);
        return;
      }
      showSuccess(`已生成 ${codes?.length || 0} 个邀请码`);
      loadData(1, pageSize);
    } catch {
      showError('生成邀请码失败');
    } finally {
      setLoading(false);
    }
  };

  const deleteInviteCode = async (id) => {
    setLoading(true);
    try {
      const res = await API.delete(`/api/invite-code/${id}`);
      const { success, message } = res.data;
      if (!success) {
        showError(message);
        return;
      }
      showSuccess('删除成功');
      loadData(page, pageSize);
    } catch {
      showError('删除失败');
    } finally {
      setLoading(false);
    }
  };

  const copyInviteCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      showSuccess(`已复制：${code}`);
    } catch {
      showError('复制失败，请手动复制');
    }
  };

  useEffect(() => {
    loadData(1, pageSize);
  }, []);

  const columns = [
    {
      title: '邀请码',
      dataIndex: 'code',
      render: (code) => <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{code}</span>,
    },
    {
      title: '状态',
      dataIndex: 'is_used',
      render: (isUsed) =>
        isUsed ? <Tag color='red'>已使用</Tag> : <Tag color='green'>可用</Tag>,
    },
    {
      title: '创建时间',
      dataIndex: 'created_time',
      render: (ts) => (ts ? new Date(ts * 1000).toLocaleString() : '-'),
    },
    {
      title: '使用者',
      dataIndex: 'used_by',
      render: (usedBy) => usedBy || '-',
    },
    {
      title: '操作',
      dataIndex: 'id',
      render: (id, record) => (
        <Space>
          <Button
            theme='borderless'
            type='tertiary'
            size='small'
            onClick={() => copyInviteCode(record.code)}
          >
            复制
          </Button>
          <Button
            theme='borderless'
            type='danger'
            size='small'
            onClick={() => deleteInviteCode(id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className='mt-[60px] px-2'>
      <Card>
        <Space style={{ marginBottom: 12 }}>
          <InputNumber min={1} max={100} value={generateCount} onChange={setGenerateCount} />
          <Button type='primary' loading={loading} onClick={generateInviteCodes}>
            生成邀请码
          </Button>
          <Button theme='outline' onClick={() => loadData(page, pageSize)}>
            刷新
          </Button>
        </Space>
        <Table
          rowKey='id'
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{
            currentPage: page,
            pageSize,
            total,
            pageSizeOpts: [10, 20, 50, 100],
            onPageChange: (nextPage) => loadData(nextPage, pageSize),
            onPageSizeChange: (size) => loadData(1, size),
          }}
        />
      </Card>
    </div>
  );
};

export default InviteCodePage;
