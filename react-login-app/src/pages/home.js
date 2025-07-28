import React, { useEffect, useState } from "react"; // hooks ko import kara hian
import axios from "axios"; //axios ek libarary hai jo HTTP requests ko handle karne ke liye use hoti hai
import { useNavigate, useLocation,Link } from "react-router-dom";


const Home = () => {      // home ke function ko define kara hian
  const navigate = useNavigate(); // navigation ke liye function milta hai
  const location = useLocation(); // location state ko access karne ke liye
  const [searchTerm, setSearchTerm] = useState(""); // for search input
  const role = localStorage.getItem("role");


  

  // Prevent leaving /home by URL change or browser navigation unless intent is set
  useEffect(() => {
    // Redirect non-admin users to /products
    if (role !== "admin") {
      navigate("/products", { replace: true });
      return;
    }
    // Prevent leaving /home by URL change or browser navigation unless intent is set
    if (location.pathname !== "/home") {
      if (!(location.state && location.state.navigation_intent)) {
        navigate("/home", { replace: true });
      }
    }
  }, [location, navigate, role]);

  const [users, setUsers] = useState([]);  // useState hook ka use kar rahe hain data ko store karne ke liye
  // in ablove intial value ko empty rkha hai 

  const [editingUser, setEditingUser] = useState(null); // jis user ko edit kar rahe hain uska data store karne ke liye
  const [editFormData, setEditFormData] = useState({ name: "", email: "" }); // edit form ke data ke liye state

  // Fetch all users
  useEffect(() => { // useEffect hook ka use kar rahe hain jo component mount hone par call hota 
    fetchUsers(); // fetchUsers function ko call karte hain jo users ko fetch karega
  }, []);

  const fetchUsers = () => {
    const token = localStorage.getItem("token");  //  token ko localStorage se le rahe hain
    axios   // ye GET request send karta hai to display all users
      .get("http://localhost:5000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`  //  header me token bhej rahe hain
        }
      })
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(" Error fetching users:", err));
  };

  // 🗑 Delete a user
  const handleDelete = async (id) => { // ye function user ko delete karne ke liye hai
    const confirm = window.confirm("Are you sure you want to delete?");
    if (!confirm) return;
    // ek bar confrom hona ke baad nicha vala code chalega

    try {
      console.log(" Sending delete request for:", id);
      const token = localStorage.getItem("token"); //  token le rahe hain
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`  //  header me token bhej rahe hain
        }
      }); // backend par DELETE request bhejta hai
      fetchUsers(); // Refresh the list after deletion
    } catch (err) {
      console.error(" Error deleting user:", err);
    }
  };

  // 🖊 Show edit form
  const handleEdit = (userId) => {
    const user = users.find((u) => u._id === userId); // id se user ko find karo
    setEditingUser(user); // editingUser set kar do
    setEditFormData({ name: user.name, email: user.email }); // form me value bharo
  };

  // Form ke input fields me changes update karna
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  //  Edit form submit karna aur backend me update bhejna
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // token fetch kar rahe hain
      await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, editFormData, {
        headers: {
          Authorization: `Bearer ${token}` //  header me token bhejna hai
        }
      }); // PUT request bhejo
      setEditingUser(null); // form ko close karo
      fetchUsers(); // fresh list le lo
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message === "User already exists") {
        // Removed: alert("User already exists");
      } else {
        console.error(" Error updating user:", err);
      }
    }
  };

  return (
    <div style={{
      flex: 1,
      padding: "40px 0",
      fontFamily: "'Inter', Arial, sans-serif",
      background: "var(--color-bg)",
      minHeight: "100vh"
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "48px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "2rem",
              fontWeight: 800,
              color: "var(--color-primary)",
              marginBottom: "18px",
              letterSpacing: "0.01em"
            }}
          >
            👥 Registered Users
          </h2>
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: "var(--color-surface)",
              color: "var(--color-text)",
              borderRadius: "10px",
              padding: "14px 20px",
              width: "320px",
              height: "40px",
              border: "1.5px solid var(--color-border)",
              fontSize: "16px",
              outline: "none",
              marginBottom: "18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              fontFamily: "inherit"
            }}
          />
        </div>
        {editingUser && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '30px 0', background: 'var(--color-surface)', borderRadius: '16px', padding: '16px 0', boxShadow: '0 4px 16px rgba(26,35,126,0.08)' }}>
            <form
              onSubmit={handleUpdate}
              style={{
                background: 'var(--color-surface)',
                padding: '32px 32px 24px 32px',
                border: '2.5px solid var(--color-primary)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '420px',
                boxShadow: '0 8px 32px rgba(26,35,126,0.10)',
                fontFamily: 'inherit',
                zIndex: 10
              }}
            >
              <h3 style={{ color: 'var(--color-primary)', fontWeight: 700 }}>Edit User</h3>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ color: 'var(--color-text)' }}>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1.5px solid var(--color-border)",
                    fontSize: "15px",
                    marginTop: "4px",
                    background: "var(--color-bg)",
                    color: "var(--color-text)"
                  }}
                  required
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ color: 'var(--color-text)' }}>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "8px",
                    border: "1.5px solid var(--color-border)",
                    fontSize: "15px",
                    marginTop: "4px",
                    background: "var(--color-bg)",
                    color: "var(--color-text)"
                  }}
                  required
                />
              </div>
              <button type="submit" style={{
                background: "var(--color-primary)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 24px",
                fontWeight: 600,
                fontSize: "16px",
                marginRight: "10px",
                cursor: "pointer"
              }}>
                Save
              </button>{" "}
              <button
                onClick={() => setEditingUser(null)}
                style={{
                  background: "var(--color-danger)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 24px",
                  fontWeight: 600,
                  fontSize: "16px",
                  cursor: "pointer"
                }}
                type="button"
              >
                Cancel
              </button>
            </form>
          </div>
        )}
        <div style={{
          background: "var(--color-surface)",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(96,165,250,0.08)",
          padding: "32px 0 24px 0",
          marginBottom: "40px"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--color-surface)", borderRadius: "12px" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-bg)" }}>
                <th style={{ padding: "16px 8px", fontWeight: 700, color: "var(--color-primary)", fontSize: "17px" }}>Sno.</th>
                <th style={{ padding: "16px 8px", fontWeight: 700, color: "var(--color-primary)", fontSize: "17px" }}>Name</th>
                <th style={{ padding: "16px 8px", fontWeight: 700, color: "var(--color-primary)", fontSize: "17px" }}>Email</th>
                {role === "admin" && <th style={{ padding: "16px 8px", fontWeight: 700, color: "var(--color-primary)", fontSize: "17px" }}>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) =>
                  u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  u.email.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((u, index) => (
                  <tr key={u._id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td style={{ padding: "14px 8px", textAlign: "center", fontWeight: 500, color: 'var(--color-text)' }}>{index + 1}</td>
                    <td style={{ padding: "14px 8px", fontWeight: 500, color: 'var(--color-text)' }}>{u.name}</td>
                    <td style={{ padding: "14px 8px", fontWeight: 500, color: 'var(--color-text)' }}>{u.email}</td>
                    {role === "admin" && (
                      <td style={{ padding: "14px 8px" }}>
                        <button onClick={() => handleEdit(u._id)} style={{
                          background: "var(--color-accent)",
                          color: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          padding: "8px 18px",
                          fontWeight: 600,
                          fontSize: "15px",
                          marginRight: "8px",
                          cursor: "pointer"
                        }}>
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(u._id)}
                          style={{
                            background: "var(--color-danger)",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            padding: "8px 18px",
                            fontWeight: 600,
                            fontSize: "15px",
                            cursor: "pointer"
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={role === "admin" ? 4 : 3} style={{ textAlign: "center", padding: "20px", color: "#888" }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

//  Inline styles
const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid var(--color-border)"
};

const tdStyle = {
  padding: "10px",
  textAlign: "left"
};

const editBtnStyle = {
  padding: "6px 12px",
  marginRight: "5px",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-surface)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const deleteBtnStyle = {
  padding: "6px 12px",
  backgroundColor: "var(--color-danger)",
  color: "var(--color-surface)",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  border: "1px solid var(--color-border)",
  borderRadius: "4px",
  background: "var(--color-bg)",
  color: "var(--color-text)"
};

export default Home;
