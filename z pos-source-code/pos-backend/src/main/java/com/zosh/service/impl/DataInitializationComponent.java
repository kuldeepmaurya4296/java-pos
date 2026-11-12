package com.zosh.service.impl;

import com.zosh.domain.StoreStatus;
import com.zosh.domain.UserRole;
import com.zosh.modal.*;
import com.zosh.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializationComponent implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final BranchRepository branchRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeSuperAdminUser();
        initializeDemoEnvironment();
    }

    private void initializeSuperAdminUser() {
        String adminUsername = "codewithzosh@gmail.com";

        if (userRepository.findByEmail(adminUsername) == null) {
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode("codewithzosh"));
            adminUser.setFullName("Super Admin");
            adminUser.setEmail(adminUsername);
            adminUser.setRole(UserRole.ROLE_ADMIN);

            userRepository.save(adminUser);
            log.info("Super Admin seeded: {}", adminUsername);
        }
    }

    private void initializeDemoEnvironment() {
        String storeAdminEmail = "admin@pos.com";
        String cashierEmail = "cashier@pos.com";

        if (userRepository.findByEmail(storeAdminEmail) == null) {
            // 1. Create Store Admin
            User storeAdmin = new User();
            storeAdmin.setEmail(storeAdminEmail);
            storeAdmin.setPassword(passwordEncoder.encode("admin123"));
            storeAdmin.setFullName("Demo Store Admin");
            storeAdmin.setRole(UserRole.ROLE_STORE_ADMIN);
            storeAdmin = userRepository.save(storeAdmin);

            // 2. Create Store
            Store store = Store.builder()
                    .brand("FreshMart POS Superstore")
                    .description("Flagship retail supermarket with integrated POS & barcode scanner")
                    .storeType("Supermarket")
                    .status(StoreStatus.ACTIVE)
                    .storeAdmin(storeAdmin)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            store = storeRepository.save(store);

            storeAdmin.setStore(store);
            userRepository.save(storeAdmin);

            // 3. Create Branch
            Branch branch = Branch.builder()
                    .name("Downtown Central Branch")
                    .address("100 Market St, Downtown")
                    .phone("+1 555-0199")
                    .email("downtown@freshmart.com")
                    .store(store)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            branch = branchRepository.save(branch);

            // 4. Create POS Cashier
            if (userRepository.findByEmail(cashierEmail) == null) {
                User cashier = new User();
                cashier.setEmail(cashierEmail);
                cashier.setPassword(passwordEncoder.encode("cashier123"));
                cashier.setFullName("John Cashier");
                cashier.setRole(UserRole.ROLE_BRANCH_CASHIER);
                cashier.setStore(store);
                cashier.setBranch(branch);
                userRepository.save(cashier);
                log.info("POS Cashier seeded: {}", cashierEmail);
            }

            // 5. Create Sample Categories & Products & Inventory
            Category bevCat = new Category();
            bevCat.setName("Beverages");
            bevCat.setStore(store);
            bevCat = categoryRepository.save(bevCat);

            Category snacksCat = new Category();
            snacksCat.setName("Snacks");
            snacksCat.setStore(store);
            snacksCat = categoryRepository.save(snacksCat);

            Product p1 = Product.builder()
                    .name("Coca Cola 500ml")
                    .sku("890103000001")
                    .description("Chilled carbonated soft drink")
                    .mrp(40.0)
                    .sellingPrice(38.0)
                    .brand("Coca Cola")
                    .category(bevCat)
                    .store(store)
                    .createdAt(LocalDateTime.now())
                    .build();
            p1 = productRepository.save(p1);

            Product p2 = Product.builder()
                    .name("Lays Classic Salted 50g")
                    .sku("890103000002")
                    .description("Crispy potato chips")
                    .mrp(20.0)
                    .sellingPrice(20.0)
                    .brand("Lays")
                    .category(snacksCat)
                    .store(store)
                    .createdAt(LocalDateTime.now())
                    .build();
            p2 = productRepository.save(p2);

            Product p3 = Product.builder()
                    .name("Nestle KitKat 4-Finger")
                    .sku("890103000003")
                    .description("Crisp wafer bar covered with smooth milk chocolate")
                    .mrp(30.0)
                    .sellingPrice(28.0)
                    .brand("Nestle")
                    .category(snacksCat)
                    .store(store)
                    .createdAt(LocalDateTime.now())
                    .build();
            p3 = productRepository.save(p3);

            inventoryRepository.save(Inventory.builder().branch(branch).product(p1).quantity(100).build());
            inventoryRepository.save(Inventory.builder().branch(branch).product(p2).quantity(150).build());
            inventoryRepository.save(Inventory.builder().branch(branch).product(p3).quantity(75).build());

            log.info("Demo store, branch, products and inventory seeded successfully!");
        }
    }
}
