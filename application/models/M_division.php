<?php
class M_division extends CI_Model {
    
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    public function insert_division($data) {
        return $this->db->insert('division', $data);
    }

    public function get_division_data() {
        $sql = "SELECT * FROM division WHERE divisionActive = 1 ORDER BY divisionId DESC";
        $query = $this->db->query($sql);
        return $query->result();
    }
}
?>