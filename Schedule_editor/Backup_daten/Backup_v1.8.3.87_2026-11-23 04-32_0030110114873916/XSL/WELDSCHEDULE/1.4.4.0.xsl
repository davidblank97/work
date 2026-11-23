<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="yes" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->
	<xsl:template match="sched/global/pipe_diameter_edit_mode">
		<xsl:copy-of select="."/>
		<torch_centering_height>0.0</torch_centering_height>
	</xsl:template>
	
	<xsl:template match="sched/segment/*[last()]">
		<xsl:copy-of select="."/>
		<mig_pulse_deadband>0.1</mig_pulse_deadband>
		<mig_pulse_slowband>2.0</mig_pulse_slowband>
		<mig_pulse_low_sensitivity>0.1</mig_pulse_low_sensitivity>
		<mig_pulse_high_sensitivity>0.25</mig_pulse_high_sensitivity>
		<mig_pulse_start_delay>0.05</mig_pulse_start_delay>
		<mig_pulse_stop_delay>0</mig_pulse_stop_delay>
		<mig_pulse_exponential_smoothing>0.5</mig_pulse_exponential_smoothing>
		<mig_pulse_p_gain>12.0</mig_pulse_p_gain>
		<mig_pulse_i_gain>0.5</mig_pulse_i_gain>
		<mig_pulse_d_gain>4.0</mig_pulse_d_gain>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>