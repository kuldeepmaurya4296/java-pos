package com.zosh.service.impl;

import com.zosh.domain.UserRole;
import com.zosh.exception.ResourceNotFoundException;
import com.zosh.modal.Customer;
import com.zosh.modal.Store;
import com.zosh.modal.User;
import com.zosh.repository.CustomerRepository;
import com.zosh.service.CustomerService;
import com.zosh.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final UserService userService;

    @Override
    public Customer createCustomer(Customer customer) {
        if (customer.getStore() == null) {
            try {
                User user = userService.getCurrentUser();
                if (user.getStore() != null) {
                    customer.setStore(user.getStore());
                } else if (user.getBranch() != null && user.getBranch().getStore() != null) {
                    customer.setStore(user.getBranch().getStore());
                }
            } catch (Exception ignored) {}
        }
        return customerRepository.save(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customerData) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Customer not found with id " + id));

        customer.setFullName(customerData.getFullName());
        customer.setEmail(customerData.getEmail());
        customer.setPhone(customerData.getPhone());

        return customerRepository.save(customer);
    }

    @Override
    public void deleteCustomer(Long id) throws ResourceNotFoundException {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
        customerRepository.delete(customer);
    }

    @Override
    public Customer getCustomerById(Long id) throws ResourceNotFoundException {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id " + id));
    }

    @Override
    public List<Customer> getAllCustomers() {
        try {
            User user = userService.getCurrentUser();
            if (user.getRole() == UserRole.ROLE_ADMIN) {
                return customerRepository.findAll();
            }
            Store store = user.getStore() != null ? user.getStore() : (user.getBranch() != null ? user.getBranch().getStore() : null);
            if (store != null) {
                return customerRepository.findByStoreId(store.getId());
            }
        } catch (Exception ignored) {}
        return customerRepository.findAll();
    }

    @Override
    public List<Customer> searchCustomer(String keyword) {
        try {
            User user = userService.getCurrentUser();
            Store store = user.getStore() != null ? user.getStore() : (user.getBranch() != null ? user.getBranch().getStore() : null);
            if (store != null) {
                return customerRepository.searchByStoreAndKeyword(store.getId(), keyword);
            }
        } catch (Exception ignored) {}
        return customerRepository.findByFullNameContainingIgnoreCaseOrEmailContainingIgnoreCase(keyword, keyword);
    }

}
