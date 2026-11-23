<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output indent="no" omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line-->

	<xsl:template match="/user_preferences">
		<xsl:copy>
			<xsl:apply-templates select="@*|node()"/>
			<preference tag="mig_pulse_start_delay" value="0.05"/>
			<preference tag="mig_pulse_stop_delay" value="0"/>
			<preference tag="mig_pulse_exponential_smoothing" value="0.5"/>
			<preference tag="mig_pulse_p_gain" value="12.0"/>
			<preference tag="mig_pulse_i_gain" value="0.5"/>
			<preference tag="mig_pulse_d_gain" value="4.0"/>
		</xsl:copy>
	</xsl:template>

	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>
</xsl:stylesheet>