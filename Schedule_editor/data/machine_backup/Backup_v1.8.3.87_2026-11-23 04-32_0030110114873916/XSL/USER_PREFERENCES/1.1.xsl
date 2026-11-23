<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"> 
  <xsl:output indent="no" omit-xml-declaration="yes"/>
  <xsl:preserve-space elements="*" />
  <!-- Add your XSL Transformations below this line -->
  <xsl:template match="BlueJaySystemSettings" >
     <user_preferences>
       <metadata>
         <schema_version/>
         <config_version>1.1.0</config_version>
         <author>Liburdi Automation</author>
         <date>02/08/2021</date>
       </metadata>
	<preference tag="are_alarms_enabled" value="true"/>
	<preference tag="enable_verbose_channel2" value="false"/>
	<preference tag="enable_travel_position_control" value="true"/>
	<preference tag="enable_large_inputs_mode" value="true"/>
	<preference tag="enable_datalog">
	 <xsl:attribute name="value"><xsl:value-of select="./DataLog/Enable"/></xsl:attribute> 
	</preference>
	<preference tag="datalog_sample_interval">
	 <xsl:attribute name="value"><xsl:value-of select="./DataLog/SampleInterval_s"/></xsl:attribute> 
	</preference>
	<preference tag="enable_tracelog">
	 <xsl:attribute name="value"><xsl:value-of select="./TraceLog/Enable"/></xsl:attribute> 
	</preference>
	<preference tag="enable_eventlog">
	 <xsl:attribute name="value"><xsl:value-of select="./EventLog/Enable"/></xsl:attribute> 
	</preference>
	<preference tag="enable_auto_login" value="false"/>
	<preference tag="enable_verbose_channel1" value="false"/>
	<preference tag="enable_verbose_channel3" value="false"/>
	<preference tag="enable_verbose_channel4" value="false"/>
	<preference tag="enable_verbose_channel5" value="false"/>
	<preference tag="enable_verbose_channel6" value="false"/>
	<preference tag="enable_verbose_channel7" value="false"/>
	<preference tag="enable_verbose_channel8" value="false"/>
	<preference tag="enable_verbose_acc" value="false"/>
	<preference tag="enable_verbose_power_supply" value="false"/>
	<preference tag="enable_verbose_groove_tracker" value="false"/>
	<preference tag="enable_verbose_closed_loop" value="false"/>
	<preference tag="enable_verbose_groove_positioning" value="false"/>
	<preference tag="enable_verbose_weldhead" value="false"/>
	<preference tag="enable_deadlock_debug" value="false"/>
	<preference tag="auto_login_user_name" value="ADMIN"/>
	<preference tag="user_preference_access_level" value="0"/>
	<preference tag="pid_tuner_sample_interval" value="0.050000"/>
	<preference tag="enable_restart_weld" value="false"/>
	<preference tag="should_prompt_to_save_overrides" value="false"/>
	<preference tag="only_enable_fan_while_welding" value="true"/>
	<preference tag="fan_disable_delay" value="60.000000"/>
	<preference tag="should_validate_schedule_signature" value="false"/>
	<preference tag="should_validate_chainset_signature" value="false"/>
	<preference tag="trace_log_file_limit" value="100"/>
	<preference tag="event_log_file_limit" value="500"/>
	<preference tag="data_log_file_limit" value="5000"/>
	<preference tag="enable_power_supply_development_mode" value="false"/>
	<preference tag="enable_verbose_datalog" value="false"/>  
	<preference tag="is_cooler_enabled_manually" value="false"/>
	<preference tag="gas_flow_setpoint" value="0.000000"/>
	<preference tag="gas_flow_warning_deviation" value="40.000000"/>
	<preference tag="no_gas_flow_deviation" value="50.000000"/>
	<preference tag="no_gas_flow_rate" value="30.000000"/>
	<preference tag="is_cooler_always_on" value="false"/>
	<preference tag="is_plasma_gas_always_on" value="false"/>
	<preference tag="should_filter_motion_telemetry" value="false"/>
	<preference tag="motion_filter_moving_average_size" value="5"/>
	<preference tag="should_use_motion_median_filter" value="false"/>
	<preference tag="should_use_motion_moving_average_filter" value="false"/>
	<preference tag="should_filter_power_supply_telemetry" value="true"/>
	<preference tag="should_use_power_supply_median_filter" value="true"/>
	<preference tag="should_use_power_supply_moving_average_filter" value="true"/>
	<preference tag="power_supply_filter_moving_average_size" value="5"/>
	<preference tag="should_reset_motion_filters_on_pulse_transitions" value="true"/>
	<preference tag="should_reset_power_supply_filters_on_pulse_transitions" value="false"/>
	<preference tag="should_disable_gas_and_cooler_when_weld_is_aborted" value="true"/>
	<preference tag="can_enable_gmaw_p_open_loop_mode" value="false"/>
	<preference tag="should_power_supply_mock_arc_on" value="false"/>
	<preference tag="is_gmaw_p_closed_loop_in_software" value="true"/>
	<preference tag="should_log_high_speed_data" value="false"/>
	<preference tag="mig_pulse_deadBand_volts" value="0.100000"/>
	<preference tag="mig_pulse_slowBand_volts" value="2.000000"/>
	<preference tag="mig_pulse_low_sensitivity" value="0.100000"/>
	<preference tag="mig_pulse_high_sensitivity" value="0.100000"/>
	<preference tag="mig_pulse_start_delay_s" value="0.050000"/>
	<preference tag="mig_pulse_stop_delay_s" value="0.000000"/>
	<preference tag="mig_pulse_update_interval_s" value="0.005000"/>
	<preference tag="mig_pulse_exponential_smoothing" value="0.500000"/>
	<preference tag="mig_pulse_p_gain" value="12.000000"/>
	<preference tag="mig_pulse_i_gain" value="0.500000"/>
	<preference tag="mig_pulse_d_gain" value="4.000000"/>
	<preference tag="mig_pulse_i_sat_gain" value="0.000000"/>
	<preference tag="mig_pulse_voltage_slope" value="19.600000"/>
	<preference tag="mig_pulse_voltage_offset" value="-295.000000"/>
	<preference tag="mig_pulse_use_voltage_for_initial_pulse_width" value="true"/>
	<preference tag="should_log_wire_motor_current" value="false"/>
	<preference tag="should_log_osc_position" value="false"/>
	<preference tag="should_log_acc_position" value="false"/>
	<preference tag="should_log_amps_pulse_width" value="true"/>
	<preference tag="should_log_power_supply_filtered_data" value="true"/>
	<preference tag="mig_pulse_detect_short_volts" value="60.000000"/>
	<preference tag="mig_pulse_clear_short_volts" value="60.000000"/>
	<preference tag="mig_pulse_clear_short_ramp_rate" value="60.000000"/>
	<preference tag="should_mig_pulse_clear_short_in_primary_pulse" value="true"/>
	<preference tag="should_mig_pulse_clear_short_in_background_pulse" value="true"/>
	<preference tag="should_power_supply_check_in_regulation" value="false"/>
	<preference tag="mig_pulse_exponential_decay_period" value="0"/>
	<preference tag="should_start_mig_pulse_from_background_state" value="true"/>
	<preference tag="mig_pulse_short_circuit_volts" value="12.000000"/>
	<preference tag="mig_pulse_open_circuit_volts" value="35.000000"/>
	<preference tag="should_log_power_supply_split_data" value="true"/>
	<preference tag="mig_pulse_dynamics_voltage_threshold" value="10.000000"/>
	<preference tag="mig_pulse_dynamics_wetting_amps" value="20.000000"/>
	<preference tag="mig_pulse_dynamics_wetting_time" value="0.000250"/>
	<preference tag="mig_pulse_dynamics_wetting_ramp_rate" value="120.000000"/>
	<preference tag="mig_pulse_dynamics_start_delay" value="0.025000"/>
	<preference tag="mig_pulse_dynamics_max_amps" value="500.000000"/>
	<preference tag="should_log_heat_input" value="true"/>
	<preference tag="mig_pulse_open_circuit_amps" value="5.000000"/>
	<preference tag="enable_groove_tracking_log" value="false"/>
    </user_preferences>
  </xsl:template>
  
  <!-- Do not change the template below-->  
  <xsl:template match="node()|@*" name="identity">
    <xsl:copy>
      <xsl:apply-templates select="node()|@*"/>
    </xsl:copy>
  </xsl:template>

</xsl:stylesheet>