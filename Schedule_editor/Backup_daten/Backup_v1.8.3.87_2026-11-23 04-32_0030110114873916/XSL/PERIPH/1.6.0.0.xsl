<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output omit-xml-declaration="yes"/>
	<xsl:preserve-space elements="*" />
	<!-- Add your XSL Transformations below this line -->

	<xsl:template match="/peripheral/devices/gas_controller/shield[@type='OMRON-MEMS']" >
		<shield>
			<telemetry type="OMRON-MEMS" />
		</shield>
	</xsl:template>
	<xsl:template match="/peripheral/devices/gas_controller/trail[@type='OMRON-MEMS']" >
		<trail>
			<telemetry type="OMRON-MEMS" />
		</trail>
	</xsl:template>
	<xsl:template match="/peripheral/devices/gas_controller/shield[@type='SST']" >
		<shield>
			<setpoint type="SST" channel="4" address="1" />
		</shield>
	</xsl:template>
	<xsl:template match="/peripheral/devices/gas_controller/plasma[@type='SST']" >
		<plasma>
			<setpoint type="SST" channel="4" address="2" />
		</plasma>
	</xsl:template>
	<xsl:template match="/peripheral/ports/ethernet[@channel='1']/timeout">
		<timeout>2</timeout>
	</xsl:template>
	<xsl:template match="/peripheral/ports/ethernet[@channel='1']/protocol" >
		<xsl:copy-of select="."/>
		<xsl:choose>
			<xsl:when test="/peripheral/ports/ethernet[@channel='1']/timeout"/>
			<xsl:otherwise>
				<timeout>2</timeout>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	
	
	<!-- Do not change the template below-->
	<xsl:template match="node()|@*" name="identity">
		<xsl:copy>
			<xsl:apply-templates select="node()|@*"/>
		</xsl:copy>
	</xsl:template>

</xsl:stylesheet>