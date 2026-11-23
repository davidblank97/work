<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/advanced_parameters/process[@name='PULSE']/*[last()]">
		<xsl:copy-of select="."/>
		<parameter>mig_pulse_deadband</parameter>
		<parameter>mig_pulse_slowband</parameter>
		<parameter>mig_pulse_low_sensitivity</parameter>
		<parameter>mig_pulse_high_sensitivity</parameter>
		<parameter>mig_pulse_start_delay</parameter>
		<parameter>mig_pulse_stop_delay</parameter>
		<parameter>mig_pulse_exponential_smoothing</parameter>
		<parameter>mig_pulse_p_gain</parameter>
		<parameter>mig_pulse_i_gain</parameter>
		<parameter>mig_pulse_d_gain</parameter>
		<parameter>dip_dynamics_enable_voltage_threshold</parameter>
		<parameter>dip_dynamics_wetting_ramp_rate</parameter>
		<parameter>dip_dynamics_clear_short_max_current</parameter>
		<parameter>dip_pulse_exponential_decay_period</parameter>
		<parameter>dip_dynamics_clear_short_threshold</parameter>
		<parameter>dip_dynamics_detect_short_threshold</parameter>
		<parameter>dip_dynamics_clear_short_ramp_rate</parameter>
		<parameter>dip_dynamics_short_wetting_time</parameter>
		<parameter>dip_dynamic_wetting_amps_drop</parameter>
	</xsl:template>
	
	<!-- Do not change the template below -->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>