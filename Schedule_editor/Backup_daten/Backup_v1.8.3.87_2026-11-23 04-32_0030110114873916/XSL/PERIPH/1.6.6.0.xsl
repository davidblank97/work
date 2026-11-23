<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->


	<xsl:template match="/peripheral[@name='GTVII 1 SST' or @name='GTVII 2 SST']/devices/gas_controller/shield">
		<shield solenoid="false">
			<setpoint type="SST" channel="4" address="1" />
		</shield>
	</xsl:template>

	<xsl:template match="/peripheral[@name='GTVII 2 SST']/devices/gas_controller/plasma">
		<plasma solenoid="false">
			<setpoint type="SST" channel="4" address="2" />
		</plasma>
	</xsl:template>
		
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>