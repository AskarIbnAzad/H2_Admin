# Article Assignment Modal Implementation Guide

## What has been implemented:

1. **Generic ArticleAssignmentModal component** - Created at `/src/Component/ArticleAssignmentModal/ArticleAssignmentModal.js`
2. **ArticleTypeTable** - Fully implemented with article assignment modal
3. **Diseases** - Fully implemented with article assignment modal  
4. **Species** - Partially implemented (needs completion)

## Remaining screens to implement:

1. **Organ/Tissues** (`/src/Screen/DashboardScreens/OrgansTable/OrgansTable.js`)
2. **Physiological Systems** (`/src/Screen/DashboardScreens/PhysiologicalSystemsTable/PhysiologicalSystemsTable.js`)
3. **Methods of Administration** (`/src/Screen/DashboardScreens/MethodsOfAdministrationTable/MethodsOfAdministrationTable.js`)

## Implementation Pattern:

For each remaining screen, follow these steps:

### 1. Import the Modal Component
```javascript
import ArticleAssignmentModal from "../../../Component/ArticleAssignmentModal/ArticleAssignmentModal";
import { FileTextOutlined } from "@ant-design/icons";
```

### 2. Add State Variables
```javascript
const [assignmentCounts, setAssignmentCounts] = useState({});
const [isAssignModalVisible, setIsAssignModalVisible] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
```

### 3. Add Assignment Count Fetching Function
```javascript
const fetchAssignmentCounts = async () => {
  try {
    // Update the endpoint based on the screen:
    // - Organ/Tissues: '/organ-tissue-assignment-counts'
    // - Physiological Systems: '/physiological-system-assignment-counts' 
    // - Methods of Administration: '/method-administration-assignment-counts'
    const response = await apiHandle.get('/ENDPOINT_HERE');
    setAssignmentCounts(response.data?.counts || {});
  } catch (error) {
    console.error("Error fetching assignment counts:", error);
  }
};
```

### 4. Call fetchAssignmentCounts in useEffect
```javascript
useEffect(() => {
  // existing code...
  //
}, [dispatch]);
```

### 5. Add fetchAssignmentCounts to add/edit/delete functions
```javascript
// In handleModalOk, handleDelete, etc.
//
```

### 6. Add Manage Articles Function
```javascript
const handleManageArticles = (item) => {
  setSelectedItem(item);
  setIsAssignModalVisible(true);
};
```

### 7. Update Table Columns
Add "Assigned Articles" column and "Manage Articles" button:

```javascript
const columns = [
  // existing columns...
  {
    title: "Assigned Articles",
    key: "assignedCount", 
    render: (_, record) => (
      <Badge 
        count={assignmentCounts[record.id] || 0} 
        style={{ backgroundColor: '#004c78' }}
      />
    ),
  },
  {
    title: "Actions",
    key: "actions",
    render: (_, record) => (
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {/* existing buttons */}
        <Button
          style={{
            backgroundColor: "#1890ff",
            color: "white", 
            borderColor: "#1890ff",
          }}
          icon={<FileTextOutlined />}
          onClick={() => handleManageArticles(record)}
        >
          Manage Articles
          <Badge 
            count={assignmentCounts[record.id] || 0} 
            style={{ backgroundColor: '#ff4d4f', marginLeft: 8 }}
          />
        </Button>
        {/* existing buttons */}
      </div>
    ),
  },
];
```

### 8. Add Modal to JSX
```javascript
{/* Article Assignment Modal */}
<ArticleAssignmentModal
  visible={isAssignModalVisible}
  onCancel={() => {
    setIsAssignModalVisible(false);
    setSelectedItem(null);
  }}
  selectedItem={selectedItem}
  assignmentType="ASSIGNMENT_TYPE_HERE" // See mapping below
  onAssignmentChange={fetchAssignmentCounts}
/>
```

## Assignment Type Mapping:

- **Organ/Tissues**: `assignmentType="organ-tissue"`
- **Physiological Systems**: `assignmentType="physiological-system"`
- **Methods of Administration**: `assignmentType="method-administration"`

## API Format:

The modal now uses the standardized API format:

**Assignment API:**
```
POST /api/articles/data/add
{
  "article_id": 415,
  "field": "species", 
  "data": {
    "name": "Mice",
    "status": "verified"
  }
}
```

**Removal API:**
```
POST /api/articles/data/remove
{
  "article_id": 415,
  "field": "species",
  "data": {
    "name": "Mice"
  }
}
```

## Field Name Mapping:

The modal automatically maps assignment types to field names:
- `research-topic` → `researchtopic`
- `article-type` → `studyType` 
- `disease` → `disease`
- `species` → `species`
- `organ-tissue` → `organ_tissue`
- `physiological-system` → `physiological_system`
- `method-administration` → `method_administration`

## API Endpoints Expected:

Each screen needs corresponding backend endpoints:
- `GET /SCREEN-assignment-counts` - Returns assignment counts
- `POST /api/articles/data/add` - Assigns articles (standardized)
- `POST /api/articles/data/remove` - Removes article assignment (standardized)

The ArticleAssignmentModal will automatically handle the filter parameters for the final-article-list API based on the assignmentType.
