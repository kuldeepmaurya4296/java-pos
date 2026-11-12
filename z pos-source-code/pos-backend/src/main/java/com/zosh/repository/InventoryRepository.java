package com.zosh.repository;

import com.zosh.modal.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    java.util.Optional<Inventory> findByBranchIdAndProductId(Long branchId, Long productId);
    List<Inventory> findByProductId(Long productId);
    List<Inventory> findByBranchId(Long branchId);

    @Query("""
        SELECT COUNT(i)
        FROM Inventory i
        JOIN i.product p
        WHERE i.branch.id = :branchId
        AND i.quantity <= 5
    """)
    int countLowStockItems(@Param("branchId") Long branchId);

}
