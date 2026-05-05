import React, { useState, useEffect } from 'react';
import {
    Modal,
    Input,
    Checkbox,
    Button,
    Space,
    Typography,
    notification,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {apiHandle} from "../../Config/ApiHandle/apiHandle";

const { Text } = Typography;

const OrganDiseaseAssignmentModal = ({
         visible,
         onCancel,
         sourceItem,
         sourceType,        // "disease" or "organ"
         allItems,          // array of objects { id, name } of the opposite type
         onAssignmentChange,
     }) => {
    // Initially assigned IDs (fetched from API)
    const [assignedIds, setAssignedIds] = useState([]);
    // All items that we consider as available (allItems minus assigned)
    const [availableItems, setAvailableItems] = useState([]);
    const [assignedItems, setAssignedItems] = useState([]);

    // Selections for the UI (user can toggle)
    const [selectedAssignedItemIds, setSelectedAssignedItemIds] = useState([]);
    const [selectedAvailableItemIds, setSelectedAvailableItemIds] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Fetch current relations when modal opens
    useEffect(() => {
        if (visible && sourceItem) {
            setLoading(true);
            apiHandle.post('/get-organ-disease-relations', {
                type: sourceType,
                id: sourceItem.id,
            })
                .then(res => {
                    const linked = res.data.linked_ids || [];
                    setAssignedIds(linked);
                })
                .catch(err => {
                    notification.error({ message: 'Failed to load relations' });
                })
                .finally(() => setLoading(false));
        }
    }, [visible, sourceItem, sourceType]);

    // Recompute assignedItems and availableItems when assignedIds or allItems change
    useEffect(() => {
        if (!allItems || assignedIds.length === 0) {
            setAssignedItems([]);
            setAvailableItems(allItems || []);
            return;
        }
        const assigned = allItems.filter(item => assignedIds.includes(item.id));
        const available = allItems.filter(item => !assignedIds.includes(item.id));
        setAssignedItems(assigned);
        setAvailableItems(available);
    }, [assignedIds, allItems]);

    // Reset selections when panels change
    useEffect(() => {
        setSelectedAssignedItemIds([]);
        setSelectedAvailableItemIds([]);
    }, [assignedItems, availableItems]);

    // Filter available items by search
    const filteredAvailable = availableItems.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );

    // The final set of target IDs = all assigned IDs MINUS any unselected assigned items PLUS selected available items
    const getFinalTargetIds = () => {
        // Start with all originally assigned IDs
        let final = [...assignedIds];
        // Remove any that were unselected in the assigned panel
        final = final.filter(id => !selectedAssignedItemIds.includes(id));
        // Add any newly selected from available panel
        selectedAvailableItemIds.forEach(id => {
            if (!final.includes(id)) final.push(id);
        });
        return final;
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const targetIds = getFinalTargetIds();
            await apiHandle.post('/update-organ-disease-relations', {
                source_type: sourceType,
                source_id: sourceItem.id,
                target_ids: targetIds,
            });
            notification.success({ message: `Relations updated successfully!` });
            onCancel(); // close modal
            if (onAssignmentChange) onAssignmentChange();
        } catch (error) {
            notification.error({ message: 'Failed to update relations' });
        } finally {
            setSaving(false);
        }
    };

    const oppositeEntity = sourceType === 'disease' ? 'organs' : 'diseases';

    // Helper to select/deselect all assigned items
    const handleSelectAllAssigned = (checked) => {
        if (checked) {
            setSelectedAssignedItemIds(assignedItems.map(item => item.id));
        } else {
            setSelectedAssignedItemIds([]);
        }
    };

    // Helper to select/deselect all (filtered) available items
    const handleSelectAllAvailable = (checked) => {
        if (checked) {
            setSelectedAvailableItemIds(filteredAvailable.map(item => item.id));
        } else {
            setSelectedAvailableItemIds([]);
        }
    };

    return (
        <Modal
            title={`Manage ${oppositeEntity} for "${sourceItem?.name}"`}
            open={visible}
            onCancel={onCancel}
            width={1200}   // same as ArticleAssignmentModal
            footer={[
                <Button key="close" onClick={onCancel}>
                    Close
                </Button>,
                <Button
                    key="save"
                    type="primary"
                    loading={saving}
                    onClick={handleSave}
                    style={{ backgroundColor: '#004c78', borderColor: '#004c78' }}
                >
                    Save
                </Button>,
            ]}
        >
            <div style={{ display: 'flex', gap: '24px', maxHeight: '70vh' }}>
                {/* Left panel – Currently Assigned (will be removed if deselected) */}
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <h3 style={{ color: '#004c78', margin: 0 }}>
                            Currently Assigned {oppositeEntity} ({assignedItems.length})
                        </h3>
                        <Checkbox
                            checked={
                                selectedAssignedItemIds.length === assignedItems.length &&
                                assignedItems.length > 0
                            }
                            indeterminate={
                                selectedAssignedItemIds.length > 0 &&
                                selectedAssignedItemIds.length < assignedItems.length
                            }
                            onChange={(e) => handleSelectAllAssigned(e.target.checked)}
                        >
                            Select All
                        </Checkbox>
                    </div>
                    <div
                        style={{
                            maxHeight: '50vh',
                            overflowY: 'auto',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '12px',
                        }}
                    >
                        {assignedItems.length === 0 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 0',
                                    color: '#999',
                                }}
                            >
                                No {oppositeEntity} currently assigned
                            </div>
                        ) : (
                            assignedItems.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '6px',
                                        marginBottom: '8px',
                                        backgroundColor: selectedAssignedItemIds.includes(item.id)
                                            ? '#ffe6e6'
                                            : '#f9f9f9',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        setSelectedAssignedItemIds(prev =>
                                            prev.includes(item.id)
                                                ? prev.filter(id => id !== item.id)
                                                : [...prev, item.id]
                                        )
                                    }
                                >
                                    <div style={{ display: 'flex', alignItems: 'start' }}>
                                        <Checkbox
                                            checked={selectedAssignedItemIds.includes(item.id)}
                                            style={{ marginRight: '12px', marginTop: '2px' }}
                                        />
                                        <Text strong style={{ color: '#004c78' }}>
                                            {item.name}
                                        </Text>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right panel – Available items to add */}
                <div style={{ flex: 1 }}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '16px',
                        }}
                    >
                        <h3 style={{ color: '#004c78', margin: 0 }}>
                            Available {oppositeEntity} ({availableItems.length})
                        </h3>
                        <Checkbox
                            checked={
                                selectedAvailableItemIds.length === filteredAvailable.length &&
                                filteredAvailable.length > 0
                            }
                            indeterminate={
                                selectedAvailableItemIds.length > 0 &&
                                selectedAvailableItemIds.length < filteredAvailable.length
                            }
                            onChange={(e) => handleSelectAllAvailable(e.target.checked)}
                        >
                            Select All
                        </Checkbox>
                    </div>
                    <Input
                        placeholder={`Search ${oppositeEntity}...`}
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        style={{ marginBottom: '12px' }}
                    />
                    <div
                        style={{
                            maxHeight: '45vh',
                            overflowY: 'auto',
                            border: '1px solid #f0f0f0',
                            borderRadius: '8px',
                            padding: '12px',
                        }}
                    >
                        {filteredAvailable.length === 0 ? (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '40px 0',
                                    color: '#999',
                                }}
                            >
                                {searchText
                                    ? `No ${oppositeEntity} matching your search`
                                    : `No ${oppositeEntity} available`}
                            </div>
                        ) : (
                            filteredAvailable.map(item => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '12px',
                                        border: '1px solid #e8e8e8',
                                        borderRadius: '6px',
                                        marginBottom: '8px',
                                        backgroundColor: selectedAvailableItemIds.includes(item.id)
                                            ? '#e6f7ff'
                                            : '#fff',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() =>
                                        setSelectedAvailableItemIds(prev =>
                                            prev.includes(item.id)
                                                ? prev.filter(id => id !== item.id)
                                                : [...prev, item.id]
                                        )
                                    }
                                >
                                    <div style={{ display: 'flex', alignItems: 'start' }}>
                                        <Checkbox
                                            checked={selectedAvailableItemIds.includes(item.id)}
                                            style={{ marginRight: '12px', marginTop: '2px' }}
                                        />
                                        <Text strong style={{ color: '#004c78' }}>
                                            {item.name}
                                        </Text>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default OrganDiseaseAssignmentModal;
