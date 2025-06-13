package com.itenas.iyip_platform.entity;

import com.itenas.iyip_platform.entity.base.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "regular_users")
@DiscriminatorValue("REGULAR")
@Getter
@Setter
public class RegularUser extends User {

    @Column(unique = true, length = 11)
    private String nim;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private Gender gender;

    @Column(length = 100)
    private String province;

    @Column(length = 100)
    private String city;

    public enum Gender {
        LAKI_LAKI("Laki-laki"),
        PEREMPUAN("Perempuan");

        private final String displayName;

        Gender(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }
}